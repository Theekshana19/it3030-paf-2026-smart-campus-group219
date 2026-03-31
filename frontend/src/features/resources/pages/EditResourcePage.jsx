import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';

import * as resourcesApi from '../api/resourcesApi.js';
import * as tagsApi from '../api/tagsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { useResourceTags } from '../hooks/useResourceTags.js';
import { RESOURCE_TYPES } from '../types/resource.types.js';

import ResourceEditSummaryCard from '../components/ResourceEditSummaryCard.jsx';
import OperationalStateCard from '../components/OperationalStateCard.jsx';
import ResourceEditCoreInfoForm from '../components/ResourceEditCoreInfoForm.jsx';
import ResourceEditCapacityLocationForm from '../components/ResourceEditCapacityLocationForm.jsx';
import ResourceEditAvailabilityForm from '../components/ResourceEditAvailabilityForm.jsx';
import ResourceEditStatusForm from '../components/ResourceEditStatusForm.jsx';
import ResourceFeaturesCard from '../components/ResourceFeaturesCard.jsx';
import ResourceAccessPermissionsCard from '../components/ResourceAccessPermissionsCard.jsx';
import LiveInsightsPanel from '../components/LiveInsightsPanel.jsx';
import ResourceImagePreview from '../components/ResourceImagePreview.jsx';
import SaveActionFooter from '../components/SaveActionFooter.jsx';
import { successAlert } from '../../../utils/sweetAlerts.js';

const resourceTypeValues = RESOURCE_TYPES.map((t) => t.value);
const resourceTypeEnum = z.enum(resourceTypeValues);
const statusEnum = z.enum(['ACTIVE', 'OUT_OF_SERVICE']);

const editSchema = z
  .object({
    resourceName: z.string().min(1, 'Resource name is required'),
    resourceCode: z.string().min(1, 'Resource code is required'),
    resourceType: resourceTypeEnum,
    equipmentSubtype: z.string().optional(),

    capacity: z.union([z.string(), z.number()]).optional(),

    building: z.string().min(1, 'Building name is required'),
    floor: z.string().optional(),
    roomOrAreaIdentifier: z.string().optional(),
    fullLocationDescription: z.string().optional(),

    defaultAvailableFrom: z.string().min(1, 'From time is required'),
    defaultAvailableTo: z.string().min(1, 'To time is required'),
    workingDays: z.array(z.string()).min(1, 'Select at least one working day'),

    status: statusEnum,
    statusNotes: z.string().optional(),

    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // capacity cannot be negative (mirrors add-resource validation)
    if (data.capacity !== undefined && data.capacity !== '') {
      const n = typeof data.capacity === 'number' ? data.capacity : Number(data.capacity);
      if (Number.isNaN(n) || n < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Capacity cannot be negative',
          path: ['capacity'],
        });
      }
    }

    const from = data.defaultAvailableFrom?.slice(0, 5);
    const to = data.defaultAvailableTo?.slice(0, 5);
    if (from && to && from >= to) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'From time must be before to time',
        path: ['defaultAvailableTo'],
      });
    }
    if (data.resourceType === 'EQUIPMENT' && !data.equipmentSubtype?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Equipment subtype is required for equipment resources',
        path: ['equipmentSubtype'],
      });
    }
  });

function SkeletonCard({ className = '' }) {
  return (
    <div
      className={[
        'bg-surface-container-lowest rounded-xl shadow-sm animate-pulse',
        className,
      ].join(' ')}
    />
  );
}

function toTimeInputValue(t) {
  if (!t) return '';
  return String(t).slice(0, 5);
}

function normalizeTimeForBackend(t) {
  if (!t) return undefined;
  const trimmed = String(t).trim();
  if (trimmed.length === 5) return `${trimmed}:00`;
  return trimmed;
}

function splitWorkingDays(s) {
  if (!s) return [];
  return String(s)
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function EditResourcePage() {
  const { resourceId } = useParams();
  const { ensureTag } = useResourceTags();

  const [resource, setResource] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [saving, setSaving] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(null);

  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [initialSelectedTags, setInitialSelectedTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const defaultValues = useMemo(
    () => ({
      resourceName: '',
      resourceCode: '',
      resourceType: 'LAB',
      equipmentSubtype: '',
      capacity: '',
      building: '',
      floor: '',
      roomOrAreaIdentifier: '',
      fullLocationDescription: '',
      defaultAvailableFrom: '08:00',
      defaultAvailableTo: '20:00',
      workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
      status: 'ACTIVE',
      statusNotes: '',
      description: '',
    }),
    []
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const watchedStatus = watch('status');
  const watchedResourceType = watch('resourceType');

  useEffect(() => {
    setMaintenanceEnabled(watchedStatus === 'OUT_OF_SERVICE');
  }, [watchedStatus]);

  const load = useCallback(async () => {
    if (!resourceId) return;
    setLoading(true);
    setError(null);
    try {
      const [r, sched] = await Promise.all([
        resourcesApi.getResourceById(resourceId),
        resourcesApi.listResourceStatusSchedules(resourceId),
      ]);

      setResource(r);
      setSchedules(Array.isArray(sched) ? sched : []);

      const initial = {
        resourceCode: r.resourceCode ?? '',
        resourceName: r.resourceName ?? '',
        resourceType: r.resourceType ?? 'LAB',
        equipmentSubtype: r.equipmentSubtype ?? '',
        capacity: r.capacity ?? '',
        building: r.building ?? '',
        floor: r.floor ?? '',
        roomOrAreaIdentifier: r.roomOrAreaIdentifier ?? '',
        fullLocationDescription: r.fullLocationDescription ?? '',
        defaultAvailableFrom: toTimeInputValue(r.defaultAvailableFrom) || '08:00',
        defaultAvailableTo: toTimeInputValue(r.defaultAvailableTo) || '20:00',
        workingDays:
          splitWorkingDays(r.workingDays).length > 0
            ? splitWorkingDays(r.workingDays)
            : ['MON', 'TUE', 'WED', 'THU', 'FRI'],
        status: r.status ?? 'ACTIVE',
        statusNotes: r.statusNotes ?? '',
        description: r.description ?? '',
      };

      setInitialFormValues(initial);
      setMaintenanceEnabled(initial.status === 'OUT_OF_SERVICE');

      const tags = Array.isArray(r.tags) ? r.tags : [];
      const normalizedTags = tags.map((t) => ({
        tagId: t.tagId,
        tagName: t.tagName,
      }));
      setInitialSelectedTags(normalizedTags);
      setSelectedTags(normalizedTags);

      reset(initial);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [resourceId, reset]);

  useEffect(() => {
    load();
  }, [load]);

  const onDiscard = useCallback(() => {
    if (initialFormValues) reset(initialFormValues);
    setSelectedTags(initialSelectedTags);
    toast.message('Changes discarded.');
  }, [initialFormValues, initialSelectedTags, reset]);

  const onAddTag = useCallback((tag) => {
    setSelectedTags((prev) => {
      if (prev.some((p) => p.tagId === tag.tagId)) return prev;
      return [...prev, tag];
    });
  }, []);

  const onRemoveTag = useCallback((tagId) => {
    setSelectedTags((prev) => prev.filter((t) => t.tagId !== tagId));
  }, []);

  const onCreateTag = useCallback(
    async (name) => {
      return ensureTag(name);
    },
    [ensureTag]
  );

  const scheduleForToday = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return (Array.isArray(schedules) ? schedules : []).filter((s) => {
      const date = s.scheduleDate ? String(s.scheduleDate) : '';
      return date === todayKey;
    });
  }, [schedules]);

  const onSave = useCallback(
    async (values) => {
      if (!resourceId || !resource) return;
      setSaving(true);
      try {
        const nextStatus = values.status;
        const payload = {
          resourceCode: values.resourceCode.trim(),
          resourceName: values.resourceName.trim(),
          resourceType: values.resourceType,
          equipmentSubtype:
            values.resourceType === 'EQUIPMENT'
              ? values.equipmentSubtype?.trim() || undefined
              : undefined,
          capacity:
            values.capacity === '' || values.capacity === null || values.capacity === undefined
              ? null
              : Number(values.capacity),
          building: values.building.trim(),
          floor: values.floor?.trim() || undefined,
          roomOrAreaIdentifier: values.roomOrAreaIdentifier?.trim() || undefined,
          fullLocationDescription: values.fullLocationDescription?.trim() || undefined,
          defaultAvailableFrom: normalizeTimeForBackend(values.defaultAvailableFrom),
          defaultAvailableTo: normalizeTimeForBackend(values.defaultAvailableTo),
          workingDays: Array.isArray(values.workingDays) ? values.workingDays.join(',') : undefined,
          status: nextStatus,
          statusNotes: values.statusNotes?.trim() || undefined,
          description: values.description?.trim() || undefined,
          isActive: nextStatus === 'ACTIVE',
        };

        await resourcesApi.updateResource(resourceId, payload);

        const initialIds = new Set(initialSelectedTags.map((t) => t.tagId));
        const selectedIds = new Set(selectedTags.map((t) => t.tagId));
        const toAdd = [...selectedIds].filter((id) => !initialIds.has(id));
        const toRemove = [...initialIds].filter((id) => !selectedIds.has(id));

        for (const tagId of toAdd) {
          try {
            await tagsApi.addTagToResource(resourceId, tagId);
          } catch (e) {
            toast.error(`Failed to add tag: ${getErrorMessage(e)}`);
          }
        }
        for (const tagId of toRemove) {
          try {
            await tagsApi.removeTagFromResource(resourceId, tagId);
          } catch (e) {
            toast.error(`Failed to remove tag: ${getErrorMessage(e)}`);
          }
        }

        await successAlert({ title: 'Resource updated successfully' });
        await load();
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setSaving(false);
      }
    },
    [initialSelectedTags, load, resource, resourceId, selectedTags]
  );

  const submit = handleSubmit(onSave);

  return (
    <div className="p-6 lg:p-10 max-w-[1440px] mx-auto w-full">
      {error ? (
        <div
          className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-on-error-container font-body mb-6"
          role="alert"
        >
          {getErrorMessage(error)}{' '}
          <button type="button" className="font-bold underline ml-1" onClick={() => load()}>
            Retry
          </button>
        </div>
      ) : null}

      {/* Summary header (bento style) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-8">
          {loading || !resource ? (
            <SkeletonCard className="h-[188px]" />
          ) : (
            <ResourceEditSummaryCard
              resourceName={resource.resourceName}
              resourceCode={resource.resourceCode}
              smartAvailabilityStatus={resource.smartAvailabilityStatus}
              nextBookingTime={resource.nextBookingTime}
              building={resource.building}
              floor={resource.floor}
              capacity={resource.capacity}
              updatedAt={resource.updatedAt ? String(resource.updatedAt) : null}
              updatedBy={resource.updatedAt ? 'Admin' : null}
            />
          )}
        </div>

        <div className="lg:col-span-4">
          <OperationalStateCard
            maintenanceEnabled={maintenanceEnabled}
            onMaintenanceEnabledChange={(v) => {
              setMaintenanceEnabled(v);
              setValue('status', v ? 'OUT_OF_SERVICE' : 'ACTIVE');
            }}
            onBroadcast={() => toast.message('Broadcast Urgent Alert: coming soon')}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Edit form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={submit} noValidate className="space-y-8">
            <ResourceEditCoreInfoForm
              register={register}
              resourceType={watchedResourceType}
              errors={errors}
            />
            <ResourceEditCapacityLocationForm register={register} errors={errors} />
            <ResourceEditAvailabilityForm control={control} register={register} errors={errors} />
            <ResourceEditStatusForm control={control} register={register} errors={errors} />

            <ResourceFeaturesCard
              selectedTags={selectedTags}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onCreateTag={onCreateTag}
            />

            <ResourceAccessPermissionsCard />

            <SaveActionFooter onDiscard={onDiscard} onSave={submit} saving={saving} />
          </form>
        </div>

        {/* Right column: Live insights + map preview */}
        <aside className="space-y-6">
          <div>
            {loading || !resource ? (
              <SkeletonCard className="h-96" />
            ) : (
              <LiveInsightsPanel
                todayBookingCount={resource.todayBookingCount}
                schedules={scheduleForToday}
              />
            )}
          </div>
          <ResourceImagePreview label="Locate on Digital Twin" subtitle="Sector A • Zone 2" />
        </aside>
      </div>
    </div>
  );
}

