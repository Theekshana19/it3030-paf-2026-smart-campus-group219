/**
 * @param {{
 *  label: string;
 *  hint: string;
 *  checked: boolean;
 *  onChange: (checked:boolean)=>void;
 *  disabled?: boolean;
 * }} props
 */
export default function ScheduleToggleField({ label, hint, checked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col pr-4">
        <span className="text-sm font-semibold text-on-surface">{label}</span>
        <span className="text-[11px] text-on-surface-variant">{hint}</span>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          onChange(!checked);
        }}
        className={`w-10 h-6 rounded-full relative p-1 flex items-center transition-colors ${
          checked ? 'bg-primary justify-end' : 'bg-surface-container-highest justify-start'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-pressed={checked}
      >
        <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
      </button>
    </div>
  );
}
