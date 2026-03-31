/**
 * @param {{ status?: string | null; nextBookingTime?: string | null }} props
 */
export default function ResourceStatusPill({ status, nextBookingTime }) {
  const s = String(status || '').toUpperCase();
  if (s !== 'BUSY_SOON') return null;
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold ring-1 ring-orange-200">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
      </span>
      Busy Soon - Next Booking at {String(nextBookingTime || '').slice(0, 5)}
    </div>
  );
}

