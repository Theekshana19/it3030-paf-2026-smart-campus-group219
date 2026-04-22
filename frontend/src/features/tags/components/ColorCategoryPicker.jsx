import { TAG_COLOR_PRESETS } from '../constants/tagColorPresets.js';

/**
 * @param {{ value?: string; onChange: (hex: string) => void; disabled?: boolean }} props
 */
export default function ColorCategoryPicker({ value, onChange, disabled }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.05em] mb-2">Color category</p>
      <div className="flex flex-wrap gap-2">
        {TAG_COLOR_PRESETS.map((c) => {
          const selected = value === c.value;
          return (
            <button
              key={c.id}
              type="button"
              disabled={disabled}
              title={c.label}
              onClick={() => onChange(c.value)}
              className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-105 disabled:opacity-50 ${
                selected ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-white shadow-md'
              }`}
              style={{ backgroundColor: c.value }}
              aria-label={c.label}
              aria-pressed={selected}
            />
          );
        })}
      </div>
    </div>
  );
}
