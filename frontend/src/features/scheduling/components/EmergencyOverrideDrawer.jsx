import { Controller } from 'react-hook-form';
import Icon from '../../../components/common/Icon.jsx';
import { confirmEmergencyOverrideAlert } from '../../../utils/sweetAlerts.js';
import useEmergencyOverride from '../hooks/useEmergencyOverride.js';
import MultiResourceSelector from './MultiResourceSelector.jsx';
import ScheduleConflictPreview from './ScheduleConflictPreview.jsx';
import ScheduleToggleField from './ScheduleToggleField.jsx';
import UrgentOverrideWarning from './UrgentOverrideWarning.jsx';

/**
 * @param {{ open: boolean; onClose: () => void; onSuccess?: () => void }} props
 */
export default function EmergencyOverrideDrawer({ open, onClose, onSuccess }) {
  const { form, control, values, precheckResult, precheckLoading, submitting, applyEmergency, close } =
    useEmergencyOverride({ open, onClose, onSuccess });

  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const handleConfirmClick = async () => {
    const ok = await confirmEmergencyOverrideAlert({});
    if (!ok) return;
    await applyEmergency();
  };

  if (!open) return null;

  const scheduled = values.effectiveMode === 'SCHEDULED';

  return (
    <>
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="fixed inset-0 bg-on-surface/45 backdrop-blur-[2px] z-50 transition-opacity"
        onClick={close}
      />
      <aside className="fixed right-0 top-0 h-[100dvh] w-[520px] max-w-[94vw] bg-white/95 backdrop-blur-xl z-[60] shadow-[0_32px_64px_-12px_rgba(23,28,31,0.25)] flex flex-col font-body border-l border-white/20">
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">Emergency Override</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Force urgent status changes across multiple resources. Overlapping active schedules are skipped.
            </p>
          </div>
          <button type="button" className="p-2 hover:bg-surface-container rounded-full transition-all" onClick={close}>
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-6">
          <UrgentOverrideWarning />

          <Controller
            control={control}
            name="resourceIds"
            render={({ field }) => (
              <MultiResourceSelector
                value={field.value}
                onChange={field.onChange}
                disabled={submitting}
                errorMessage={errors.resourceIds?.message}
              />
            )}
          />

          <section className="space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="tune" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Effective mode
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setValue('effectiveMode', 'IMMEDIATE', { shouldDirty: true, shouldValidate: true })}
                className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                  !scheduled ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                }`}
              >
                Immediate
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setValue('effectiveMode', 'SCHEDULED', { shouldDirty: true, shouldValidate: true })}
                className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${
                  scheduled ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low border-surface-container text-on-surface-variant'
                }`}
              >
                Scheduled
              </button>
            </div>
          </section>

          {scheduled ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="schedule" className="text-primary text-sm" />
                <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                  Scheduled window
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Date</label>
                  <input
                    type="date"
                    disabled={submitting}
                    {...register('scheduleDate')}
                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  />
                  {errors.scheduleDate ? (
                    <p className="text-xs text-error ml-1 mt-1">{errors.scheduleDate.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Start</label>
                  <input
                    type="time"
                    disabled={submitting}
                    {...register('startTime')}
                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  />
                  {errors.startTime ? <p className="text-xs text-error ml-1 mt-1">{errors.startTime.message}</p> : null}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">End</label>
                  <input
                    type="time"
                    disabled={submitting}
                    {...register('endTime')}
                    className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                  />
                  {errors.endTime ? <p className="text-xs text-error ml-1 mt-1">{errors.endTime.message}</p> : null}
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="schedule" className="text-primary text-sm" />
                <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                  Immediate window
                </label>
              </div>
              <p className="text-xs text-on-surface-variant -mt-2">
                Starts at the server time when you confirm. Optionally set an end time; otherwise the window runs until
                23:59:59 today.
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">
                  End time (optional)
                </label>
                <input
                  type="time"
                  disabled={submitting}
                  {...register('immediateEndTime')}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                />
              </div>
            </section>
          )}

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="flag" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Target status
              </label>
            </div>
            <select
              disabled={submitting}
              {...register('scheduledStatus')}
              className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-primary"
            >
              <option value="OUT_OF_SERVICE">Out of service</option>
              <option value="ACTIVE">Active (restore)</option>
            </select>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="edit_note" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Urgent reason (required)
              </label>
            </div>
            <textarea
              disabled={submitting}
              {...register('reasonNote')}
              className="w-full p-4 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary h-28 resize-none"
              placeholder="Describe the verified incident, who authorized it, and any safety context…"
            />
            {errors.reasonNote ? <p className="text-xs text-error ml-1 -mt-2">{errors.reasonNote.message}</p> : null}
          </section>

          <ScheduleConflictPreview loading={precheckLoading} result={precheckResult} />

          <section className="space-y-4 pt-2 border-t border-surface-container">
            <ScheduleToggleField
              label="Notify affected users"
              hint="Accepted by the API; notifications are not sent until Module D is available."
              checked={values.notifyAffectedUsers}
              onChange={(checked) => setValue('notifyAffectedUsers', checked, { shouldDirty: true })}
              disabled={submitting}
            />
            <ScheduleToggleField
              label="High priority"
              hint="Prefixes reason with [EMERGENCY] for audit trails when enabled."
              checked={values.highPriority}
              onChange={(checked) => setValue('highPriority', checked, { shouldDirty: true })}
              disabled={submitting}
            />
          </section>
        </div>

        <footer className="sticky bottom-0 z-10 p-6 pb-[max(1rem,env(safe-area-inset-bottom))] bg-white/80 backdrop-blur-md border-t border-surface-container flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="px-5 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
            onClick={close}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmClick}
            disabled={submitting}
            className="px-6 py-3 bg-error text-on-error font-headline font-bold text-sm rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Icon name={submitting ? 'hourglass_top' : 'lock_open'} className="text-sm" />
            {submitting ? 'Applying…' : 'Confirm override'}
          </button>
        </footer>
      </aside>
    </>
  );
}
