import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { bulkCreateSchedules, precheckSchedules } from '../api/schedulingService.js';

const schema = z
  .object({
    resourceIds: z.array(z.number()).min(1, 'Select at least one resource'),
    scheduleDate: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    scheduledStatus: z.enum(['ACTIVE', 'OUT_OF_SERVICE']),
    reasonNote: z.string().max(300, 'Reason note must be 300 characters or less').optional(),
    notifyAffectedUsers: z.boolean(),
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
  resourceIds: [],
  scheduleDate: today(),
  startTime: '',
  endTime: '',
  scheduledStatus: 'OUT_OF_SERVICE',
  reasonNote: '',
  notifyAffectedUsers: true,
};

export default function useBulkStatusUpdate({ open, onClose, onSuccess }) {
  const [precheckResult, setPrecheckResult] = useState(null);
  const [precheckLoading, setPrecheckLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  const { watch, handleSubmit, reset, control } = form;
  const values = watch();

  const runPrecheck = useCallback(async () => {
    if (!values.resourceIds?.length || !values.scheduleDate || !values.startTime || !values.endTime) {
      setPrecheckResult(null);
      return;
    }
    setPrecheckLoading(true);
    try {
      const data = await precheckSchedules({
        resourceIds: values.resourceIds,
        scheduleDate: values.scheduleDate,
        startTime: values.startTime,
        endTime: values.endTime,
      });
      setPrecheckResult(data);
    } catch (error) {
      setPrecheckResult(null);
      toast.error(getErrorMessage(error));
    } finally {
      setPrecheckLoading(false);
    }
  }, [values.resourceIds, values.scheduleDate, values.startTime, values.endTime]);

  useEffect(() => {
    if (!open) {
      setPrecheckResult(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!values.resourceIds?.length || !values.scheduleDate || !values.startTime || !values.endTime) {
        if (!cancelled) setPrecheckResult(null);
        return;
      }
      if (!cancelled) setPrecheckLoading(true);
      try {
        const data = await precheckSchedules({
          resourceIds: values.resourceIds,
          scheduleDate: values.scheduleDate,
          startTime: values.startTime,
          endTime: values.endTime,
        });
        if (!cancelled) setPrecheckResult(data);
      } catch {
        if (!cancelled) setPrecheckResult(null);
      } finally {
        if (!cancelled) setPrecheckLoading(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, values.resourceIds, values.scheduleDate, values.startTime, values.endTime]);

  useEffect(() => {
    if (!open) return;
    reset({ ...defaultValues, scheduleDate: today() });
    setPrecheckResult(null);
  }, [open, reset]);

  const applyBulk = handleSubmit(async (payload) => {
    setSubmitting(true);
    try {
      const data = await bulkCreateSchedules({
        resourceIds: payload.resourceIds,
        scheduleDate: payload.scheduleDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        scheduledStatus: payload.scheduledStatus,
        reasonNote: payload.reasonNote || '',
        notifyAffectedUsers: payload.notifyAffectedUsers,
      });
      const created = data?.totalCreated ?? 0;
      const skipped = data?.totalSkipped ?? 0;
      if (created > 0) {
        toast.success(`Bulk update: ${created} schedule(s) created${skipped ? `, ${skipped} skipped` : ''}.`);
      } else if (skipped > 0) {
        toast.warning(`No schedules created; ${skipped} resource(s) skipped.`);
      } else {
        toast.message('Bulk update completed with no changes.');
      }
      onSuccess?.();
      onClose?.();
      reset(defaultValues);
      setPrecheckResult(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  });

  const close = useCallback(() => {
    onClose?.();
    reset(defaultValues);
    setPrecheckResult(null);
  }, [onClose, reset]);

  return {
    form,
    values,
    control,
    precheckResult,
    precheckLoading,
    submitting,
    applyBulk,
    runPrecheck,
    close,
  };
}
