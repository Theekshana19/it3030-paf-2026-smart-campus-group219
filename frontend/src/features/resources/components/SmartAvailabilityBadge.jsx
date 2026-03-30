/**
 * @param {{ status?: string | null; nextBookingTime?: string | null }} props
 */
export default function SmartAvailabilityBadge({ status, nextBookingTime }) {
  const s = status || 'UNKNOWN';

  const config = {
    AVAILABLE_NOW: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
      label: 'Available now',
    },
    BUSY_SOON: {
      dot: 'bg-amber-500',
      text: 'text-amber-800',
      label: 'Busy soon',
    },
    FULLY_BOOKED_TODAY: {
      dot: 'bg-indigo-500',
      text: 'text-indigo-800',
      label: 'Fully booked today',
    },
    OUT_OF_SERVICE: {
      dot: 'bg-red-500',
      text: 'text-red-800',
      label: 'Out of service',
    },
    UNKNOWN: {
      dot: 'bg-on-surface-variant/40',
      text: 'text-on-surface-variant',
      label: '—',
    },
  };

  const c = config[s] ?? config.UNKNOWN;
  const time =
    s === 'BUSY_SOON' && nextBookingTime
      ? nextBookingTime.slice(0, 5)
      : null;

  return (
    <div className={`inline-flex items-center gap-2 min-w-0 ${c.text}`}>
      <span
        className={`w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/90 shadow-sm ${c.dot}`}
        aria-hidden
      />
      <span className="text-[11px] font-semibold font-body truncate tracking-tight">
        {c.label}
        {time ? ` (${time})` : ''}
      </span>
    </div>
  );
}
