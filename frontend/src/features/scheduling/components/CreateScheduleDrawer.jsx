import Icon from '../../../components/common/Icon.jsx';
import useCreateScheduleDrawer from '../hooks/useCreateScheduleDrawer.js';
import ResourceSelectField from './ResourceSelectField.jsx';
import SelectedResourcePreviewCard from './SelectedResourcePreviewCard.jsx';
import ScheduleConflictWarning from './ScheduleConflictWarning.jsx';
import ScheduleToggleField from './ScheduleToggleField.jsx';

/**
 * @param {{ open: boolean; onClose: () => void; onCreated: () => void; }} props
 */
export default function CreateScheduleDrawer({ open, onClose, onCreated }) {
  const { form, values, selectedResource, resources, loadingResources, conflict, submitting, submit, close, setValue } =
    useCreateScheduleDrawer({ open, onClose, onCreated });

  const {
    register,
    formState: { errors },
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
      <aside className="fixed right-0 top-0 h-screen w-[480px] max-w-[92vw] bg-white/95 backdrop-blur-xl z-[60] shadow-[0_32px_64px_-12px_rgba(23,28,31,0.25)] flex flex-col font-body border-l border-white/20">
        <div className="p-8 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">Create Schedule</h2>
            <p className="text-on-surface-variant text-sm mt-1">Add a new status change for a campus resource.</p>
          </div>
          <button type="button" className="p-2 hover:bg-surface-container rounded-full transition-all" onClick={close}>
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto p-8 space-y-8 pb-32">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="category" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Resource Selection
              </label>
            </div>
            <ResourceSelectField
              value={values.resourceId}
              onChange={(value) => setValue('resourceId', value, { shouldDirty: true, shouldValidate: true })}
              resources={resources}
              loading={loadingResources}
              error={errors.resourceId?.message}
            />
            <SelectedResourcePreviewCard resource={selectedResource} />
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="schedule" className="text-primary text-sm" />
              <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
                Schedule Details
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Date</label>
                <input
                  type="date"
                  {...register('scheduleDate')}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                />
                {errors.scheduleDate ? <p className="text-xs text-error ml-1 mt-1">{errors.scheduleDate.message}</p> : null}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Start Time</label>
                <input
                  type="time"
                  {...register('startTime')}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                />
                {errors.startTime ? <p className="text-xs text-error ml-1 mt-1">{errors.startTime.message}</p> : null}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">End Time</label>
                <input
                  type="time"
                  {...register('endTime')}
                  className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                />
                {errors.endTime ? <p className="text-xs text-error ml-1 mt-1">{errors.endTime.message}</p> : null}
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Status Dropdown</label>
                <select
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
                Reason for status change
              </label>
            </div>
            <textarea
              {...register('reasonNote')}
              className="w-full p-4 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary h-24 resize-none"
              placeholder="Provide internal notes for staff..."
            />
            {errors.reasonNote ? <p className="text-xs text-error ml-1 -mt-2">{errors.reasonNote.message}</p> : null}
          </section>

          <ScheduleConflictWarning conflict={conflict} />

          <section className="space-y-4 pt-4 border-t border-surface-container">
            <ScheduleToggleField
              label="Notify affected users"
              hint="Sends alert to booked organizers"
              checked={values.notifyAffectedUsers}
              onChange={(checked) => setValue('notifyAffectedUsers', checked, { shouldDirty: true })}
            />
            <ScheduleToggleField
              label="Mark as high priority"
              hint="Flags entry in the central dashboard"
              checked={values.highPriority}
              onChange={(checked) => setValue('highPriority', checked, { shouldDirty: true })}
            />
          </section>
        </form>

        <footer className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t border-surface-container flex items-center justify-between gap-4">
          <button
            type="button"
            className="flex-1 px-6 py-3 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
            onClick={close}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="flex-[2] px-6 py-3 bg-primary text-white font-headline font-bold text-sm rounded-xl shadow-lg hover:bg-primary-container hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Icon name={submitting ? 'hourglass_top' : 'verified'} className="text-sm" />
            {submitting ? 'Creating...' : 'Create Schedule'}
          </button>
        </footer>
      </aside>
    </>
  );
}
