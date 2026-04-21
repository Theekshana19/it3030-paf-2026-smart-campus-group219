/**
 * @param {{ status?: string }} props
 */
export default function SchedulingStatusBadge({ status }) {
  const value = String(status || '').toUpperCase();
  const styleMap = {
    OUT_OF_SERVICE: 'bg-orange-100 text-orange-700',
    ACTIVE: 'bg-emerald-100 text-emerald-700',
    RESERVED: 'bg-rose-100 text-rose-700',
    OFFLINE: 'bg-slate-200 text-slate-700',
  };
  const cls = styleMap[value] || 'bg-surface-container text-on-surface-variant';
  const label = value.replaceAll('_', ' ') || 'UNKNOWN';
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}
