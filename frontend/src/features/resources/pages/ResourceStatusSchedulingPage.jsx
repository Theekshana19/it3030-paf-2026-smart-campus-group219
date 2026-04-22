import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import * as resourcesApi from '../api/resourcesApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import ResourceScheduleHeaderCard from '../components/ResourceScheduleHeaderCard.jsx';
import TodayTimelineCard from '../components/TodayTimelineCard.jsx';
import ScheduleConflictBanner from '../components/ScheduleConflictBanner.jsx';
import ScheduleFormCard from '../components/ScheduleFormCard.jsx';
import UpcomingShiftsPanel from '../components/UpcomingShiftsPanel.jsx';
import AdminControlsCard from '../components/AdminControlsCard.jsx';
import { confirmDeleteAlert, successAlert } from '../../../utils/sweetAlerts.js';

const scheduleSchema = z
  .object({
    reasonNote: z.string().min(1, 'Reason is required'),
    scheduleDate: z.string().min(1, 'Schedule date is required'),
    scheduledStatus: z.enum(['ACTIVE', 'OUT_OF_SERVICE']),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time must be before end time',
        path: ['endTime'],
      });
    }
  });

function toBackendTime(value) {
  if (!value) return undefined;
  return value.length === 5 ? `${value}:00` : value;
}

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

function minutesOf(time) {
  const [hh, mm] = String(time || '00:00').slice(0, 5).split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function mergeIntervals(intervals) {
  if (!intervals.length) return [];
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged = [sorted[0]];
  for (let i = 1; i < sorted.length; i += 1) {
    const last = merged[merged.length - 1];
    const cur = sorted[i];
    if (cur.start <= last.end) {
      last.end = Math.max(last.end, cur.end);
    } else {
      merged.push(cur);
    }
  }
  return merged;
}

function buildTimelineFromSchedules(schedules) {
  const dayStart = 8 * 60;
  const dayEnd = 20 * 60;

  const outages = mergeIntervals(
    schedules
      .filter((s) => String(s.scheduledStatus).toUpperCase() === 'OUT_OF_SERVICE')
      .map((s) => ({ start: Math.max(dayStart, minutesOf(s.startTime)), end: Math.min(dayEnd, minutesOf(s.endTime)) }))
      .filter((s) => s.end > s.start)
  );

  if (outages.length === 0) {
    return [{ start: '08:00', end: '20:00', status: 'ACTIVE' }];
  }

  const toHHMM = (min) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
  const segments = [];
  let cursor = dayStart;
  outages.forEach((o) => {
    if (cursor < o.start) {
      segments.push({ start: toHHMM(cursor), end: toHHMM(o.start), status: 'ACTIVE' });
    }
    segments.push({ start: toHHMM(o.start), end: toHHMM(o.end), status: 'OUT_OF_SERVICE', label: 'Maint.' });
    cursor = o.end;
  });
  if (cursor < dayEnd) {
    segments.push({ start: toHHMM(cursor), end: toHHMM(dayEnd), status: 'ACTIVE' });
  }
  return segments;
}

function detectConflict(candidate, existing) {
  if (!candidate?.scheduleDate || !candidate?.startTime || !candidate?.endTime) return null;
  const cStart = minutesOf(candidate.startTime);
  const cEnd = minutesOf(candidate.endTime);
  const overlap = existing.find((s) => {
    if (s.scheduleDate !== candidate.scheduleDate) return false;
    const sStart = minutesOf(s.startTime);
    const sEnd = minutesOf(s.endTime);
    return cStart < sEnd && cEnd > sStart;
  });
  if (!overlap) return null;
  return {
    title: 'Potential Schedule Overlap',
    message: `The proposed window (${candidate.startTime} - ${candidate.endTime}) overlaps with "${overlap.reasonNote || 'existing schedule'}".`,
  };
}

const defaultForm = {
  reasonNote: '',
  scheduleDate: todayISO(),
  scheduledStatus: 'OUT_OF_SERVICE',
  startTime: '',
  endTime: '',
};

export default function ResourceStatusSchedulingPage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [adminControls, setAdminControls] = useState({
    forceGlobalOverride: false,
    autoRejectOverlaps: true,
    notifyAllOccupants: true,
  });
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: defaultForm,
    mode: 'onTouched',
  });

  const watched = watch();
  const watchedDate = watched.scheduleDate;

  useEffect(() => {
    if (watchedDate) {
      setSelectedDate(watchedDate);
    }
  }, [watchedDate]);

  const load = useCallback(async () => {
    if (!resourceId) return;
    setLoading(true);
    try {
      const [resourceData, scheduleData] = await Promise.all([
        resourcesApi.getResourceById(resourceId),
        resourcesApi.listResourceStatusSchedules(resourceId),
      ]);
      setResource(resourceData);
      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    load();
  }, [load]);

  const upcomingShifts = useMemo(() => {
    const today = todayISO();
    return [...schedules]
      .filter((s) => s.isActive !== false)
      .filter((s) => typeof s.scheduleDate === 'string' && s.scheduleDate >= today)
      .sort((a, b) => {
        const aKey = `${a.scheduleDate} ${a.startTime}`;
        const bKey = `${b.scheduleDate} ${b.startTime}`;
        return aKey.localeCompare(bKey);
      });
  }, [schedules]);

  const daySchedules = useMemo(
    () => schedules.filter((s) => s.scheduleDate === selectedDate && s.isActive !== false),
    [schedules, selectedDate]
  );

  const timelineSegments = useMemo(() => buildTimelineFromSchedules(daySchedules), [daySchedules]);
  const conflict = useMemo(() => detectConflict(watched, schedules), [schedules, watched]);
  const bookingSegment = useMemo(() => {
    // Priority 1: explicit values in the form for the selected date
    if (
      watched.startTime &&
      watched.endTime &&
      watched.scheduleDate &&
      watched.scheduleDate === selectedDate &&
      watched.startTime < watched.endTime
    ) {
      return { start: watched.startTime, end: watched.endTime };
    }

    // Priority 2: first schedule on the selected date (e.g. after reload)
    const first = daySchedules[0];
    if (!first) return null;
    const start = String(first.startTime || '').slice(0, 5);
    const end = String(first.endTime || '').slice(0, 5);
    if (!start || !end || start >= end) return null;
    return { start, end };
  }, [daySchedules, selectedDate, watched.endTime, watched.scheduleDate, watched.startTime]);

  const onSubmit = useCallback(
    async (values) => {
      if (!resourceId) return;
      setSaving(true);
      try {
        await resourcesApi.createResourceStatusSchedule(resourceId, {
          scheduleDate: values.scheduleDate,
          startTime: toBackendTime(values.startTime),
          endTime: toBackendTime(values.endTime),
          scheduledStatus: values.scheduledStatus,
          reasonNote: values.reasonNote.trim(),
          isActive: true,
        });
        await successAlert({ title: 'Schedule committed successfully' });
        reset({ ...defaultForm, scheduleDate: values.scheduleDate });
        await load();
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setSaving(false);
      }
    },
    [load, reset, resourceId]
  );

  const onDelete = useCallback(
    async (scheduleId) => {
      if (!resourceId) return;
      const ok = await confirmDeleteAlert({
        title: 'Delete Schedule?',
        text: 'This scheduled entry will be permanently removed.',
      });
      if (!ok) return;
      setDeletingId(scheduleId);
      try {
        await resourcesApi.deleteResourceStatusSchedule(resourceId, scheduleId);
        await successAlert({ title: 'Schedule deleted' });
        await load();
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setDeletingId(null);
      }
    },
    [load, resourceId]
  );

  const onSelectShift = useCallback(
    (shift) => {
      if (!shift) return;
      if (shift.scheduleDate) {
        setSelectedDate(shift.scheduleDate);
        setValue('scheduleDate', shift.scheduleDate, { shouldDirty: true });
      }
      if (shift.startTime) {
        setValue('startTime', String(shift.startTime).slice(0, 5), { shouldDirty: true });
      }
      if (shift.endTime) {
        setValue('endTime', String(shift.endTime).slice(0, 5), { shouldDirty: true });
      }
      if (shift.scheduledStatus) {
        setValue('scheduledStatus', shift.scheduledStatus, { shouldDirty: true });
      }
      if (shift.reasonNote) {
        setValue('reasonNote', shift.reasonNote, { shouldDirty: true });
      }
    },
    [setValue]
  );

  return (
    <div className="p-8 max-w-[1440px] mx-auto space-y-8">
      <div className="flex justify-between items-end gap-4">
        <div>
          <nav className="flex text-xs font-bold tracking-widest text-on-surface-variant mb-2 uppercase">
            <button type="button" className="hover:text-primary cursor-pointer" onClick={() => navigate('/resources')}>
              Resources
            </button>
            <span className="mx-2">/</span>
            <span>{resource?.resourceType || 'Resource'}</span>
            <span className="mx-2">/</span>
            <span className="text-primary">Scheduling</span>
          </nav>
          <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
            Schedule Status Change
          </h2>
        </div>
        <ResourceScheduleHeaderCard
          resourceName={loading ? 'Loading resource...' : resource?.resourceName}
          resourceType={resource?.resourceType}
          currentStatus={
            String(resource?.smartAvailabilityStatus || '').toUpperCase() === 'OUT_OF_SERVICE'
              ? 'OUT_OF_SERVICE'
              : 'ACTIVE'
          }
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <TodayTimelineCard segments={timelineSegments} bookingSegment={bookingSegment} />

          <ScheduleConflictBanner
            conflict={conflict}
            onViewConflict={() => toast.message('Detailed conflict view is coming soon.')}
          />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <ScheduleFormCard
              control={control}
              register={register}
              errors={errors}
              loading={saving}
              onDiscard={() => reset(defaultForm)}
            />
          </form>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <UpcomingShiftsPanel
            shifts={upcomingShifts}
            loading={loading}
            onDelete={onDelete}
            deletingId={deletingId}
            onSelectShift={onSelectShift}
          />
          <AdminControlsCard value={adminControls} onChange={setAdminControls} />
        </div>
      </div>
    </div>
  );
}

