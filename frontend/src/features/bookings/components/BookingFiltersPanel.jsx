import Icon from '../../../components/common/Icon.jsx';
import { BOOKING_STATUS_OPTIONS } from '../types/booking.types.js';

const labelClass = 'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';
const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';

// sidebar filters for the booking list page
export default function BookingFiltersPanel({ filters, setFilter, clearFilters }) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-manrope text-on-surface flex items-center gap-2">
          <Icon name="filter_list" className="text-lg" />
          Filters
        </h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs text-primary font-bold hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* status filter */}
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

      {/* date from filter */}
      <div>
        <label className={labelClass}>Date From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilter('dateFrom', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* date to filter */}
      <div>
        <label className={labelClass}>Date To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilter('dateTo', e.target.value)}
          className={inputClass}
        />
      </div>

      {/* user email filter */}
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
  );
}
