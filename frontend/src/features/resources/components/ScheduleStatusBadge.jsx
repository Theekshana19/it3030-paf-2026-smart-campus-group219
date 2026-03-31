/**
 * @param {{ status?: string }} props
 */
export default function ScheduleStatusBadge({ status }) {
  const normalized = String(status ?? '').toUpperCase();
  const isOut = normalized === 'OUT_OF_SERVICE';
  const label = isOut ? 'Maintenance' : 'Active';
  const className = isOut
    ? 'bg-orange-100 text-orange-700'
    : 'bg-emerald-100 text-emerald-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide ${className}`}
    >
      {label}
    </span>
  );
}

