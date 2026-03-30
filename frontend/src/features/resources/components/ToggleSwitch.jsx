/**
 * Small accessible toggle switch.
 * @param {{
 *   checked: boolean;
 *   onChange: (checked: boolean) => void;
 *   disabled?: boolean;
 *   label?: string;
 * }} props
 */
export default function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
  label,
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? 'Toggle'}
      disabled={disabled}
      onClick={() => {
        if (disabled) return;
        onChange(!checked);
      }}
      className={[
        'relative w-12 h-6 rounded-full transition-colors',
        checked ? 'bg-primary/80' : 'bg-outline-variant/30',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-6' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

