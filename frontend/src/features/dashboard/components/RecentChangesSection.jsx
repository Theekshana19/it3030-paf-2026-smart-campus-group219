import RecentChangeItem from './RecentChangeItem.jsx';

export default function RecentChangesSection({
  items,
  loading,
  page,
  size,
  totalPages,
  totalItems,
  onPrevPage,
  onNextPage,
}) {
  const hasPages = totalPages > 0;
  const from = hasPages ? page * size + 1 : 0;
  const to = hasPages ? Math.min((page + 1) * size, totalItems) : 0;

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
      <div className="mt-4 pt-4 border-t border-outline-variant/20 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">
          {hasPages ? `${from}-${to} of ${totalItems}` : '0 results'}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={loading || page <= 0}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-low text-on-surface disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={loading || !hasPages || page >= totalPages - 1}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-low text-on-surface disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
