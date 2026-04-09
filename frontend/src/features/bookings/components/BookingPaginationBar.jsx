import Icon from '../../../components/common/Icon.jsx';

// pagination controls for the booking list
export default function BookingPaginationBar({ page, totalPages, rangeStart, rangeEnd, totalItems, setPage }) {
  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <p className="text-sm text-on-surface-variant font-body">
        Showing {rangeStart}–{rangeEnd} of {totalItems}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="p-2 rounded-lg hover:bg-surface-container-high disabled:opacity-40 transition-colors"
        >
          <Icon name="chevron_left" className="text-lg" />
        </button>

        <span className="text-sm font-medium text-on-surface font-body">
          {page + 1} / {totalPages || 1}
        </span>

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="p-2 rounded-lg hover:bg-surface-container-high disabled:opacity-40 transition-colors"
        >
          <Icon name="chevron_right" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
