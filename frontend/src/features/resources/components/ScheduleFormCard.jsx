import { Controller } from 'react-hook-form';
import { SCHEDULED_STATUS_OPTIONS } from '../types/resource.types.js';

const inputClass =
  'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none';
const labelClass =
  'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

/**
 * @param {{
 *   control: import('react-hook-form').Control<any>;
 *   register: import('react-hook-form').UseFormRegister<any>;
 *   errors: Record<string, {message?: string}|undefined>;
 *   loading?: boolean;
 *   onDiscard: () => void;
 * }} props
 */
export default function ScheduleFormCard({ control, register, errors, loading = false, onDiscard }) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)]">
      <h3 className="font-headline font-bold text-xl mb-6">Schedule Status Change</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className={labelClass}>Change Reason / Description</label>
          <input
            {...register('reasonNote')}
            className={inputClass}
            placeholder="e.g. HVAC Filter Replacement"
            type="text"
          />
          {errors.reasonNote ? <p className="text-error text-xs mt-1.5">{errors.reasonNote.message}</p> : null}
        </div>

        <div>
          <label className={labelClass}>Schedule Date</label>
          <input {...register('scheduleDate')} className={inputClass} type="date" />
          {errors.scheduleDate ? (
            <p className="text-error text-xs mt-1.5">{errors.scheduleDate.message}</p>
          ) : null}
        </div>

        <div>
          <label className={labelClass}>New Status</label>
          <Controller
            name="scheduledStatus"
            control={control}
            render={({ field }) => (
              <select {...field} className={inputClass}>
                {SCHEDULED_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        <div>
          <label className={labelClass}>Start Time</label>
          <input {...register('startTime')} className={inputClass} type="time" />
          {errors.startTime ? <p className="text-error text-xs mt-1.5">{errors.startTime.message}</p> : null}
        </div>

        <div>
          <label className={labelClass}>End Time</label>
          <input {...register('endTime')} className={inputClass} type="time" />
          {errors.endTime ? <p className="text-error text-xs mt-1.5">{errors.endTime.message}</p> : null}
        </div>

        <div className="md:col-span-2 pt-4 flex justify-end gap-4">
          <button
            type="button"
            onClick={onDiscard}
            disabled={loading}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container-high transition-colors disabled:opacity-50"
          >
            Discard
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-lg text-sm font-semibold bg-gradient-to-r from-primary to-primary-container text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Commit Schedule'}
          </button>
        </div>
      </div>
    </section>
  );
}

