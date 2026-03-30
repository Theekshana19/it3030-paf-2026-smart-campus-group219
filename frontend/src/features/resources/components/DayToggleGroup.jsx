import { WEEKDAYS } from '../types/resource.types.js';

/**
 * @param {{ value: string[]; onChange: (days: string[]) => void; error?: string }} props
 */
export default function DayToggleGroup({ value, onChange, error }) {
  const set = new Set(value);

  function toggle(day) {
    const next = new Set(set);
    if (next.has(day)) next.delete(day);
    else next.add(day);
    onChange([...next].sort((a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)));
  }

  return (
    <div className="col-span-2">
      <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label">
        Working Days
      </label>
      <div className="flex flex-wrap gap-2 mt-2">
        {WEEKDAYS.map((day) => {
          const on = set.has(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggle(day)}
              className={
                on
                  ? 'w-12 h-12 rounded-lg bg-primary text-white font-bold text-xs font-manrope shadow-md transition-all hover:opacity-95'
                  : 'w-12 h-12 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface-variant font-bold text-xs font-manrope transition-all hover:bg-surface-container-low'
              }
            >
              {day}
            </button>
          );
        })}
      </div>
      {error ? <p className="text-error text-xs mt-2 font-medium">{error}</p> : null}
    </div>
  );
}
