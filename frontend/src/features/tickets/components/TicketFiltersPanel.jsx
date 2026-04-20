import Icon from '../../../components/common/Icon.jsx';
import { TICKET_STATUS_OPTIONS, TICKET_PRIORITY_OPTIONS, TICKET_CATEGORY_OPTIONS } from '../types/ticket.types.js';

const labelClass = 'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';
const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';

// this component shows the filter sidebar on the ticket list page
// users can filter by status, priority, and category
export default function TicketFiltersPanel({ filters, setFilter, clearFilters }) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-xl shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-manrope text-on-surface flex items-center gap-2">
          <Icon name="filter_list" className="text-lg" />
          Filters
        </h3>
        <button type="button" onClick={clearFilters} className="text-xs text-primary font-bold hover:underline">
          Clear all
        </button>
      </div>

      {/* filter by ticket status */}
      <div>
        <label className={labelClass}>Status</label>
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} className={inputClass}>
          {TICKET_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* filter by priority level */}
      <div>
        <label className={labelClass}>Priority</label>
        <select value={filters.priority} onChange={(e) => setFilter('priority', e.target.value)} className={inputClass}>
          <option value="">All priorities</option>
          {TICKET_PRIORITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* filter by issue category */}
      <div>
        <label className={labelClass}>Category</label>
        <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className={inputClass}>
          <option value="">All categories</option>
          {TICKET_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
