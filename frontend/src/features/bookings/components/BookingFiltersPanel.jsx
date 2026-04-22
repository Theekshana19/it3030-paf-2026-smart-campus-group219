import Icon from '../../../components/common/Icon.jsx';
import { BOOKING_STATUS_OPTIONS } from '../types/booking.types.js';

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant/40 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-body outline-none';
const labelClass = 'block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5 font-label';

export default function BookingFiltersPanel({ filters, setFilter, clearFilters }) {
  const hasActiveFilters = filters.status || filters.dateFrom || filters.dateTo || filters.userEmail;

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-surface-container-high bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <Icon name="tune" className="text-primary text-lg" />
          <span className="text-sm font-bold font-manrope text-on-surface">Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary" />
          )}
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-primary font-semibold hover:underline font-body"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* status */}
        <div>
          <label className={labelClass}>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
            className={inputClass}
          >
            {BOOKING_STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* date from */}
        <div>
          <label className={labelClass}>Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter('dateFrom', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* date to */}
        <div>
          <label className={labelClass}>Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter('dateTo', e.target.value)}
            className={inputClass}
          />
        </div>

        {/* user email */}
        <div>
          <label className={labelClass}>User Email</label>
          <input
            type="text"
            value={filters.userEmail}
            onChange={(e) => setFilter('userEmail', e.target.value)}
            placeholder="Filter by email..."
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
