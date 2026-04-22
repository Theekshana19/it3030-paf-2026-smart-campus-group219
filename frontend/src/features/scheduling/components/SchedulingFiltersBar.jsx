import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *  filters: Record<string, string>;
 *  options: { resourceTypes: string[]; buildings: string[]; statuses: string[] };
 *  onChange: (key: string, value: string) => void;
 *  onClearAll: () => void;
 *  onRemoveFilter: (key: string) => void;
 * }} props
 */
export default function SchedulingFiltersBar({ filters, options, onChange, onClearAll, onRemoveFilter }) {
  const chips = [
    filters.search ? { key: 'search', label: `Search: ${filters.search}` } : null,
    filters.resourceType ? { key: 'resourceType', label: filters.resourceType.replaceAll('_', ' ') } : null,
    filters.building ? { key: 'building', label: filters.building } : null,
    filters.status ? { key: 'status', label: filters.status.replaceAll('_', ' ') } : null,
    filters.fromDate || filters.toDate ? { key: 'dateRange', label: `${filters.fromDate || '...'} to ${filters.toDate || '...'}` } : null,
  ].filter(Boolean);

  return (
    <div className="bg-surface-container-low p-5 rounded-xl flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px] relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          className="w-full bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20"
          placeholder="Search resources..."
        />
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select
          className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20"
          value={filters.resourceType}
          onChange={(e) => onChange('resourceType', e.target.value)}
        >
          <option value="">Resource Type</option>
          {options.resourceTypes.map((type) => (
            <option key={type} value={type}>
              {type.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
        <select
          className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20"
          value={filters.building}
          onChange={(e) => onChange('building', e.target.value)}
        >
          <option value="">Building</option>
          {options.buildings.map((building) => (
            <option key={building} value={building}>
              {building}
            </option>
          ))}
        </select>
        <select
          className="bg-surface-container-lowest border-none rounded-lg px-4 py-2.5 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20"
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option value="">Status</option>
          {options.statuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="bg-surface-container-lowest border-none rounded-lg px-3 py-2.5 text-sm"
            value={filters.fromDate}
            onChange={(e) => onChange('fromDate', e.target.value)}
          />
          <input
            type="date"
            className="bg-surface-container-lowest border-none rounded-lg px-3 py-2.5 text-sm"
            value={filters.toDate}
            onChange={(e) => onChange('toDate', e.target.value)}
          />
        </div>
      </div>

      <div className="w-full flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">Active:</span>
        {chips.length === 0 ? <span className="text-xs text-on-surface-variant">No active filters</span> : null}
        {chips.map((chip) => (
          <button
            type="button"
            key={chip.key}
            onClick={() => onRemoveFilter(chip.key)}
            className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-600"
          >
            {chip.label}
            <Icon name="close" className="text-[11px]" />
          </button>
        ))}
        {chips.length > 0 ? (
          <button
            type="button"
            className="text-[10px] font-bold text-indigo-600 uppercase hover:underline ml-2"
            onClick={onClearAll}
          >
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
}
