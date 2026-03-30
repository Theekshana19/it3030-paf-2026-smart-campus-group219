import { RESOURCE_TYPES, OPERATIONAL_STATUS_OPTIONS } from '../types/resource.types.js';
import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   filters: Record<string, string>;
 *   searchInput: string;
 *   onSearchInput: (v: string) => void;
 *   onFilterChange: (key: string, value: string) => void;
 *   onClearAll: () => void;
 *   tagOptions: { tagId: number; tagName: string }[];
 *   tagsLoading: boolean;
 *   rangeStart: number;
 *   rangeEnd: number;
 *   totalItems: number;
 *   onlyAvailableNow: boolean;
 *   onOnlyAvailableNowChange: (v: boolean) => void;
 * }} props
 */
export default function ResourceFiltersPanel({
  filters,
  searchInput,
  onSearchInput,
  onFilterChange,
  onClearAll,
  tagOptions,
  tagsLoading,
  rangeStart,
  rangeEnd,
  totalItems,
  onlyAvailableNow,
  onOnlyAvailableNowChange,
}) {
  const inputClass =
    'w-full bg-surface-container-low border-none rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 font-body outline-none text-on-surface';
  const labelClass =
    'block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5 font-label';

  const hasFilters =
    Object.values(filters).some((v) => v !== '' && v != null) || onlyAvailableNow;

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-6 md:p-7 border border-outline-variant/15 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)]">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0">
            <Icon name="filter_list" className="text-xl" />
          </span>
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface">Advanced filters</h3>
            <p className="text-xs text-on-surface-variant font-body mt-0.5">
              Narrow the catalogue by type, capacity, location, and tags.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <p className="text-xs font-medium text-on-surface-variant font-body whitespace-nowrap">
            {totalItems === 0 ? (
              'No resources to show'
            ) : (
              <>
                Showing{' '}
                <span className="font-bold text-on-surface">
                  {rangeStart}–{rangeEnd}
                </span>{' '}
                of <span className="font-bold text-on-surface">{totalItems}</span> resources
              </>
            )}
          </p>
          <button
            type="button"
            onClick={onClearAll}
            disabled={!hasFilters}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide text-primary border border-primary/25 hover:bg-primary/5 disabled:opacity-40 transition-colors"
          >
            <Icon name="close" className="text-sm" />
            Clear all
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <label className={labelClass}>Search</label>
          <input
            className={inputClass}
            placeholder="Name, code, building…"
            value={searchInput}
            onChange={(e) => onSearchInput(e.target.value)}
            type="search"
            aria-label="Search resources"
          />
        </div>
        <div>
          <label className={labelClass}>Resource type</label>
          <select
            className={inputClass}
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="">All types</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Min. capacity</label>
          <input
            className={inputClass}
            type="number"
            min={0}
            placeholder="Any"
            value={filters.minCapacity}
            onChange={(e) => onFilterChange('minCapacity', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Building</label>
          <input
            className={inputClass}
            placeholder="e.g. Turing Center"
            value={filters.building}
            onChange={(e) => onFilterChange('building', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Operational status</label>
          <select
            className={inputClass}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            {OPERATIONAL_STATUS_OPTIONS.map((o) => (
              <option key={o.value || 'any'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Tags</label>
          <select
            className={inputClass}
            value={filters.tag}
            onChange={(e) => onFilterChange('tag', e.target.value)}
            disabled={tagsLoading}
          >
            <option value="">All tags</option>
            {tagOptions.map((t) => (
              <option key={t.tagId} value={t.tagName}>
                {t.tagName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mt-5 flex items-center gap-2.5 cursor-pointer select-none w-fit">
        <input
          type="checkbox"
          checked={onlyAvailableNow}
          onChange={(e) => onOnlyAvailableNowChange(e.target.checked)}
          className="rounded border-outline-variant text-primary focus:ring-primary/30 w-4 h-4"
        />
        <span className="text-xs font-semibold text-on-surface font-body">
          Available now only{' '}
          <span className="text-on-surface-variant font-normal">(current page — API filter not available)</span>
        </span>
      </label>
    </section>
  );
}
