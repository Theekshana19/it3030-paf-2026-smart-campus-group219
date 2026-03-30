/**
 * @param {{ value: 'ACTIVE'|'OUT_OF_SERVICE'; onChange: (v: 'ACTIVE'|'OUT_OF_SERVICE') => void }} props
 */
export default function StatusRadioGroup({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label
        className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border-2 transition-colors ${
          value === 'ACTIVE'
            ? 'bg-tertiary/10 border-tertiary/25'
            : 'bg-surface-container-low border-transparent hover:border-outline-variant/20'
        }`}
      >
        <input
          checked={value === 'ACTIVE'}
          onChange={() => onChange('ACTIVE')}
          className="text-tertiary focus:ring-tertiary border-none"
          name="status"
          type="radio"
        />
        <span className="font-body text-sm font-semibold text-tertiary">Active</span>
      </label>
      <label
        className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border-2 transition-colors ${
          value === 'OUT_OF_SERVICE'
            ? 'bg-secondary/10 border-secondary/30'
            : 'bg-surface-container-low border-transparent hover:border-outline-variant/20'
        }`}
      >
        <input
          checked={value === 'OUT_OF_SERVICE'}
          onChange={() => onChange('OUT_OF_SERVICE')}
          className="text-secondary focus:ring-secondary border-none"
          name="status"
          type="radio"
        />
        <span className="font-body text-sm font-semibold text-secondary">Out of Service</span>
      </label>
    </div>
  );
}
