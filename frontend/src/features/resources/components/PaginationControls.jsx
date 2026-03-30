import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   page: number;
 *   totalPages: number;
 *   onPageChange: (p: number) => void;
 *   disabled?: boolean;
 * }} props
 */
export default function PaginationControls({ page, totalPages, onPageChange, disabled = false }) {
  if (totalPages <= 0) return null;

  const windowSize = 5;
  let start = Math.max(0, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize);
  if (end - start < windowSize) start = Math.max(0, end - windowSize);
  const pages = [];
  for (let i = start; i < end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-6 px-2 border-t border-outline-variant/20">
      <p className="text-xs text-on-surface-variant font-body">
        Page <span className="font-semibold text-on-surface">{page + 1}</span> of{' '}
        <span className="font-semibold text-on-surface">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <button
          type="button"
          disabled={disabled || page <= 0}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-semibold text-secondary hover:bg-surface-container-low disabled:opacity-40 transition-colors"
        >
          <Icon name="chevron_left" className="text-lg" />
          Previous
        </button>
        <div className="flex items-center gap-1">
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              disabled={disabled}
              onClick={() => onPageChange(p)}
              className={
                p === page
                  ? 'min-w-[2.25rem] h-9 rounded-lg bg-primary text-on-primary text-sm font-bold shadow-sm'
                  : 'min-w-[2.25rem] h-9 rounded-lg text-sm font-semibold text-secondary hover:bg-surface-container transition-colors'
              }
            >
              {p + 1}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={disabled || page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-outline-variant/30 text-sm font-semibold text-secondary hover:bg-surface-container-low disabled:opacity-40 transition-colors"
        >
          Next
          <Icon name="chevron_right" className="text-lg" />
        </button>
      </div>
    </div>
  );
}
