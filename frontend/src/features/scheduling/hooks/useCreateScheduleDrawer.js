import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { checkScheduleOverlap, createGlobalSchedule, listDrawerResources } from '../api/schedulingService.js';

const schema = z
  .object({
    resourceId: z.string().min(1, 'Resource is required'),
    scheduleDate: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    scheduledStatus: z.enum(['ACTIVE', 'OUT_OF_SERVICE']),
    reasonNote: z.string().max(300, 'Reason note must be 300 characters or less').optional(),
    notifyAffectedUsers: z.boolean(),
    highPriority: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endTime'], message: 'End time must be after start time' });
    }
  });

function today() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

const defaultValues = {
  resourceId: '',
  scheduleDate: today(),
  startTime: '',
  endTime: '',
  scheduledStatus: 'OUT_OF_SERVICE',
  reasonNote: '',
  notifyAffectedUsers: true,
  highPriority: false,
};

export default function useCreateScheduleDrawer({ open, onClose, onCreated }) {
  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [conflict, setConflict] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { watch, handleSubmit, setValue, reset } = form;
  const values = watch();

  const selectedResource = useMemo(
    () => resources.find((resource) => String(resource.resourceId) === String(values.resourceId)) || null,
    [resources, values.resourceId]
  );

  const loadResources = useCallback(async () => {
    setLoadingResources(true);
    try {
      const list = await listDrawerResources('');
      setResources(list);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingResources(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    loadResources();
  }, [open, loadResources]);

  useEffect(() => {
    if (!open || !values.resourceId || !values.scheduleDate || !values.startTime || !values.endTime) {
      setConflict(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await checkScheduleOverlap({
          resourceId: values.resourceId,
          scheduleDate: values.scheduleDate,
          startTime: values.startTime,
          endTime: values.endTime,
        });
        if (!cancelled) setConflict(result);
      } catch {
        if (!cancelled) setConflict(null);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, values.resourceId, values.scheduleDate, values.startTime, values.endTime]);

  const submit = handleSubmit(async (payload) => {
    setSubmitting(true);
    try {
      await createGlobalSchedule({
        resourceId: Number(payload.resourceId),
        scheduleDate: payload.scheduleDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        scheduledStatus: payload.scheduledStatus,
        reasonNote: payload.reasonNote || '',
        isActive: true,
      });
      toast.success('Schedule created successfully');
      onCreated?.();
      onClose?.();
      reset(defaultValues);
      setConflict(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  });

  const close = useCallback(() => {
    onClose?.();
    reset(defaultValues);
    setConflict(null);
  }, [onClose, reset]);

  return {
    form,
    values,
    selectedResource,
    resources,
    loadingResources,
    conflict,
    submitting,
    submit,
    close,
    setValue,
  };
}
