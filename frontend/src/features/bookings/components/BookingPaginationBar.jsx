import Icon from '../../../components/common/Icon.jsx';

export default function BookingPaginationBar({ page, totalPages, rangeStart, rangeEnd, totalItems, setPage }) {
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-on-surface-variant font-body">
        Showing <span className="font-semibold text-on-surface">{rangeStart}–{rangeEnd}</span> of{' '}
        <span className="font-semibold text-on-surface">{totalItems}</span> bookings
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon name="chevron_left" className="text-base" />
          Prev
        </button>

        <div className="flex items-center gap-1 mx-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const p = totalPages <= 5 ? i : Math.max(0, page - 2) + i;
            if (p >= totalPages) return null;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                  p === page
                    ? 'bg-primary text-white'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {p + 1}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container-high disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <Icon name="chevron_right" className="text-base" />
        </button>
      </div>
    </div>
  );
}
