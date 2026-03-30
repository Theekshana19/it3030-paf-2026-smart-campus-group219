import { Controller } from 'react-hook-form';
import DayToggleGroup from './DayToggleGroup.jsx';

const inputClass =
  'w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none text-on-surface';
const labelClass =
  'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

export default function ResourceEditAvailabilityForm({ control, register, errors }) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined text-xl">schedule</span>
        </span>
        <h3 className="text-lg font-bold font-manrope">Availability Window</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>From Time</label>
          <input type="time" {...register('defaultAvailableFrom')} className={inputClass} />
          {errors.defaultAvailableFrom?.message ? (
            <p className="text-error text-xs font-medium mt-1">{errors.defaultAvailableFrom.message}</p>
          ) : null}
        </div>
        <div>
          <label className={labelClass}>To Time</label>
          <input type="time" {...register('defaultAvailableTo')} className={inputClass} />
          {errors.defaultAvailableTo?.message ? (
            <p className="text-error text-xs font-medium mt-1">{errors.defaultAvailableTo.message}</p>
          ) : null}
        </div>

        <Controller
          name="workingDays"
          control={control}
          render={({ field }) => (
            <DayToggleGroup
              value={field.value}
              onChange={field.onChange}
              error={errors.workingDays?.message}
            />
          )}
        />
      </div>
    </div>
  );
}

