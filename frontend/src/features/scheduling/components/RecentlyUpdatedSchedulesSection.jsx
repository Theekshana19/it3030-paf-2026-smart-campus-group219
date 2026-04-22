import RecentlyUpdatedScheduleCard from './RecentlyUpdatedScheduleCard.jsx';

/**
 * @param {{ items: Array<any>; loading?: boolean }} props
 */
export default function RecentlyUpdatedSchedulesSection({ items, loading = false }) {
  return (
    <section className="space-y-4">
      <h3 className="text-lg font-bold font-manrope px-2">Recently Updated Schedules</h3>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-28 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <RecentlyUpdatedScheduleCard key={item.id} item={item} />
          ))}
          {items.length === 0 ? <p className="text-sm text-on-surface-variant px-2">No recent updates available.</p> : null}
        </div>
      )}
    </section>
  );
}
