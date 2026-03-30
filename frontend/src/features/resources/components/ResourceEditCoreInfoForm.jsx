import { RESOURCE_TYPES } from '../types/resource.types.js';

/**
 * Editable subset for the Edit Resource page.
 * @param {{
 *  register: (name: string) => unknown;
 *  errors: Record<string, { message?: string } | undefined>;
 * }} props
 */
export default function ResourceEditCoreInfoForm({ register, errors }) {
  const inputClass =
    'w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none text-on-surface';
  const labelClass =
    'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-xl">info</span>
        </span>
        <h3 className="text-lg font-bold font-manrope">Core Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClass}>Resource Name</label>
          <input
            {...register('resourceName')}
            className={inputClass}
            type="text"
            autoComplete="off"
          />
          {errors.resourceName?.message ? (
            <p className="text-error text-xs font-medium">{errors.resourceName.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Resource Code</label>
          <input
            {...register('resourceCode')}
            className={inputClass}
            type="text"
            autoComplete="off"
          />
          {errors.resourceCode?.message ? (
            <p className="text-error text-xs font-medium">{errors.resourceCode.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Resource Category / Type</label>
          <select {...register('resourceType')} className={inputClass}>
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {errors.resourceType?.message ? (
            <p className="text-error text-xs font-medium">{errors.resourceType.message}</p>
          ) : null}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className={labelClass}>Description</label>
          <textarea
            {...register('description')}
            className={inputClass}
            rows={3}
            placeholder="Add a short description of the resource..."
          />
          {errors.description?.message ? (
            <p className="text-error text-xs font-medium">{errors.description.message}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

