import { useMemo } from 'react';

const inputClass =
  'w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none text-on-surface';
const labelClass =
  'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

/**
 * @param {{ register: (name: string) => unknown; errors: Record<string, any> }} props
 */
export default function ResourceEditCapacityLocationForm({ register, errors }) {
  const capacityValue = useMemo(() => errors.capacity, [errors.capacity]);

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center text-tertiary">
          <span className="material-symbols-outlined text-xl">location_on</span>
        </span>
        <h3 className="text-lg font-bold font-manrope">Capacity &amp; Location</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="md:col-span-2 space-y-2">
          <label className={labelClass}>Capacity (Persons)</label>
          <input {...register('capacity')} className={inputClass} type="number" min={0} />
          {errors.capacity?.message ? (
            <p className="text-error text-xs font-medium mt-1">{errors.capacity.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-4 space-y-2">
          <label className={labelClass}>Building Name</label>
          <input {...register('building')} className={inputClass} type="text" />
          {errors.building?.message ? (
            <p className="text-error text-xs font-medium mt-1">{errors.building.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className={labelClass}>Floor</label>
          <input {...register('floor')} className={inputClass} type="text" />
          {errors.floor?.message ? (
            <p className="text-error text-xs font-medium mt-1">{errors.floor.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-4 space-y-2">
          <label className={labelClass}>Room ID</label>
          <input
            {...register('roomOrAreaIdentifier')}
            className={inputClass}
            type="text"
          />
          {errors.roomOrAreaIdentifier?.message ? (
            <p className="text-error text-xs font-medium mt-1">{errors.roomOrAreaIdentifier.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

