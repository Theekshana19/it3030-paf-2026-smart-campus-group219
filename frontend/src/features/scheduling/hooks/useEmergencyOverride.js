import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { emergencyOverrideSchedules, precheckSchedules } from '../api/schedulingService.js';

function today() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

function currentTimeHHmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const schema = z
  .object({
    resourceIds: z.array(z.number()).min(1, 'Select at least one resource'),
    effectiveMode: z.enum(['IMMEDIATE', 'SCHEDULED']),
    scheduleDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    immediateEndTime: z.string().optional(),
    scheduledStatus: z.enum(['ACTIVE', 'OUT_OF_SERVICE']),
    reasonNote: z.string().min(1, 'Urgent reason is required').max(300, 'Reason must be 300 characters or less'),
    notifyAffectedUsers: z.boolean(),
    highPriority: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.effectiveMode === 'SCHEDULED') {
      if (!data.scheduleDate) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['scheduleDate'], message: 'Date is required' });
      }
      if (!data.startTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['startTime'], message: 'Start time is required' });
      }
      if (!data.endTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endTime'], message: 'End time is required' });
      }
      if (data.startTime && data.endTime && data.startTime >= data.endTime) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['endTime'], message: 'End time must be after start time' });
      }
    }
  });

const defaultValues = {
  resourceIds: [],
  effectiveMode: 'IMMEDIATE',
  scheduleDate: today(),
  startTime: '',
  endTime: '',
  immediateEndTime: '',
  scheduledStatus: 'OUT_OF_SERVICE',
  reasonNote: '',
  notifyAffectedUsers: true,
  highPriority: false,
};

export default function useEmergencyOverride({ open, onClose, onSuccess }) {
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

  const buildPrecheckPayload = useCallback(() => {
    if (!values.resourceIds?.length) return null;
    if (values.effectiveMode === 'SCHEDULED') {
      if (!values.scheduleDate || !values.startTime || !values.endTime) return null;
      return {
        resourceIds: values.resourceIds,
        scheduleDate: values.scheduleDate,
        startTime: values.startTime,
        endTime: values.endTime,
      };
    }
    const end = values.immediateEndTime || '23:59';
    return {
      resourceIds: values.resourceIds,
      scheduleDate: today(),
      startTime: currentTimeHHmm(),
      endTime: end,
    };
  }, [values.resourceIds, values.effectiveMode, values.scheduleDate, values.startTime, values.endTime, values.immediateEndTime]);

  useEffect(() => {
    if (!open) {
      setPrecheckResult(null);
      return;
    }
    const payload = buildPrecheckPayload();
    if (!payload) {
      setPrecheckResult(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!cancelled) setPrecheckLoading(true);
      try {
        const data = await precheckSchedules(payload);
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
  }, [open, buildPrecheckPayload]);

  useEffect(() => {
    if (!open) return;
    reset({ ...defaultValues, scheduleDate: today() });
    setPrecheckResult(null);
  }, [open, reset]);

  const applyEmergency = handleSubmit(async (payload) => {
    if (payload.effectiveMode === 'IMMEDIATE' && payload.immediateEndTime) {
      const nowM = currentTimeHHmm();
      if (payload.immediateEndTime <= nowM) {
        toast.error('End time must be after the current time for an immediate override.');
        return;
      }
    }
    setSubmitting(true);
    try {
      const request =
        payload.effectiveMode === 'SCHEDULED'
          ? {
              resourceIds: payload.resourceIds,
              effectiveMode: 'SCHEDULED',
              scheduleDate: payload.scheduleDate,
              startTime: payload.startTime,
              endTime: payload.endTime,
              scheduledStatus: payload.scheduledStatus,
              reasonNote: payload.reasonNote,
              notifyAffectedUsers: payload.notifyAffectedUsers,
              highPriority: payload.highPriority,
            }
          : {
              resourceIds: payload.resourceIds,
              effectiveMode: 'IMMEDIATE',
              scheduledStatus: payload.scheduledStatus,
              reasonNote: payload.reasonNote,
              notifyAffectedUsers: payload.notifyAffectedUsers,
              highPriority: payload.highPriority,
              endTime: payload.immediateEndTime || undefined,
            };
      const data = await emergencyOverrideSchedules(request);
      const created = data?.totalCreated ?? 0;
      const skipped = data?.totalSkipped ?? 0;
      if (created > 0) {
        toast.success(`Emergency override: ${created} schedule(s) created${skipped ? `, ${skipped} skipped` : ''}.`);
      } else if (skipped > 0) {
        toast.warning(`No schedules created; ${skipped} resource(s) skipped.`);
      } else {
        toast.message('Emergency override completed with no changes.');
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
    applyEmergency,
    close,
  };
}
