import RecentChangeItem from './RecentChangeItem.jsx';

export default function RecentChangesSection({ items, loading }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-headline font-bold">Recent Changes</h2>
        <span className="text-xs font-bold bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full">
          Last 24 Hours
        </span>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((k) => (
            <div key={k} className="h-20 rounded-xl bg-surface-container animate-pulse" />
          ))}
        </div>
      ) : items.length ? (
        <div className="space-y-2">
          {items.map((item) => (
            <RecentChangeItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl p-6 bg-surface-container-low text-on-surface-variant text-sm">
          No recent operational activity yet.
        </div>
      )}
    </section>
  );
}
