import { Controller } from 'react-hook-form';
import Icon from '../../../components/common/Icon.jsx';
import useBulkStatusUpdate from '../hooks/useBulkStatusUpdate.js';
import MultiResourceSelector from './MultiResourceSelector.jsx';
import ScheduleConflictPreview from './ScheduleConflictPreview.jsx';
import ScheduleToggleField from './ScheduleToggleField.jsx';

/**
 * @param {{ open: boolean; onClose: () => void; onSuccess?: () => void }} props
 */
export default function BulkStatusUpdateDrawer({ open, onClose, onSuccess }) {
  const { form, control, values, precheckResult, precheckLoading, submitting, applyBulk, runPrecheck, close } =
    useBulkStatusUpdate({ open, onClose, onSuccess });

  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  if (!open) return null;

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
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">Bulk Status Update</h2>
            <p className="text-on-surface-variant text-sm mt-1">
              Apply one shared maintenance window to multiple resources. Conflicting rows are skipped automatically.
            </p>
          </div>
          <button type="button" className="p-2 hover:bg-surface-container rounded-full transition-all" onClick={close}>
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 pb-6">
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

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="schedule" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Shared window
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
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Status</label>
                <select
                  disabled={submitting}
                  {...register('scheduledStatus')}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm font-semibold text-orange-600 focus:ring-2 focus:ring-primary"
                >
                  <option value="OUT_OF_SERVICE">Maintenance</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="edit_note" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Reason (optional)
              </label>
            </div>
            <textarea
              disabled={submitting}
              {...register('reasonNote')}
              className="w-full p-4 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary h-24 resize-none"
              placeholder="Shared note for all created schedules…"
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
            className="px-5 py-3 text-sm font-bold text-on-surface border border-surface-container rounded-xl hover:bg-surface-container-low transition-all disabled:opacity-60"
            onClick={runPrecheck}
            disabled={submitting || precheckLoading}
          >
            Precheck
          </button>
          <button
            type="button"
            onClick={applyBulk}
            disabled={submitting}
            className="px-6 py-3 bg-primary text-white font-headline font-bold text-sm rounded-xl shadow-lg hover:bg-primary-container hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Icon name={submitting ? 'hourglass_top' : 'arrow_forward'} className="text-sm" />
            {submitting ? 'Applying…' : 'Apply bulk update'}
          </button>
        </footer>
      </aside>
    </>
  );
}
