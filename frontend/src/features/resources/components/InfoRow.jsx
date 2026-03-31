/**
 * @param {{ label: string; value: string | number | null | undefined; valueClassName?: string; }} props
 */
export default function InfoRow({ label, value, valueClassName = '' }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-surface-container last:border-b-0">
      <span className="text-sm text-secondary">{label}</span>
      <span className={['font-semibold text-on-surface', valueClassName].join(' ')}>
        {value == null || value === '' ? '—' : value}
      </span>
    </div>
  );
}

