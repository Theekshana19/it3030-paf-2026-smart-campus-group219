import { useCallback } from 'react';
import { toast } from 'sonner';
import { useTicketList } from '../hooks/useTicketList.js';
import * as ticketsApi from '../api/ticketsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import { TICKET_STATUS_OPTIONS, TICKET_PRIORITY_OPTIONS, TICKET_CATEGORY_OPTIONS } from '../types/ticket.types.js';
import TicketListHeader from '../components/TicketListHeader.jsx';
import TicketTable from '../components/TicketTable.jsx';
import TicketPaginationBar from '../components/TicketPaginationBar.jsx';
import TicketStatusBadge from '../components/TicketStatusBadge.jsx';
import TicketPriorityBadge from '../components/TicketPriorityBadge.jsx';
import EmptyTicketsState from '../components/EmptyTicketsState.jsx';
import LoadingTicketsState from '../components/LoadingTicketsState.jsx';
import Icon from '../../../components/common/Icon.jsx';

const inputClass =
  'bg-surface-container-lowest border border-surface-container-high rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-body outline-none shadow-sm';

// this is the main page that shows all incident tickets
// admin can see every ticket, normal users see only their own tickets
export default function TicketListPage() {
  const {
    filters, setFilter, clearFilters,
    searchInput, setSearchInput,
    page, setPage, sortBy, sortDir, toggleSort,
    items, totalItems, totalPages, rangeStart, rangeEnd,
    loading, refetch,
  } = useTicketList();

  // handle deleting a ticket with a confirmation dialog
  const handleDelete = useCallback(
    async (ticketId, ticketRef) => {
      const confirmed = await confirmDeleteAlert({
        title: 'Delete this ticket?',
        text: `Ticket ${ticketRef} will be permanently removed from the system.`,
      });
      if (!confirmed) return;
      try {
        await ticketsApi.deleteTicket(ticketId);
        toast.success('Ticket deleted successfully');
        refetch();
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    },
    [refetch]
  );

  const hasActiveFilters = filters.status || filters.priority || filters.category;
  const activeFilterCount = [filters.status, filters.priority, filters.category].filter(Boolean).length;

  return (
    <div className="p-6 md:p-8 w-full space-y-5">

      {/* gradient header banner */}
      <TicketListHeader totalItems={totalItems} />

      {/* ── FILTER TOOLBAR ── */}
      <div className="bg-surface-container-lowest border border-surface-container-high rounded-2xl shadow-sm px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">

          {/* search — grows to fill space */}
          <div className="relative flex-1 min-w-[180px]">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg pointer-events-none"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, description, or reference..."
              className={`${inputClass} w-full pl-9 pr-8`}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
              >
                <Icon name="close" className="text-base" />
              </button>
            )}
          </div>

          {/* divider */}
          <div className="hidden sm:block h-6 w-px bg-surface-container-high" />

          {/* status */}
          <div className="flex items-center gap-1.5">
            <Icon name="flag" className="text-on-surface-variant/60 text-base" />
            <select
              value={filters.status}
              onChange={(e) => setFilter('status', e.target.value)}
              className={`${inputClass} pr-7 appearance-none cursor-pointer`}
            >
              {TICKET_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* priority */}
          <div className="flex items-center gap-1.5">
            <Icon name="priority_high" className="text-on-surface-variant/60 text-base" />
            <select
              value={filters.priority}
              onChange={(e) => setFilter('priority', e.target.value)}
              className={`${inputClass} pr-7 appearance-none cursor-pointer`}
            >
              <option value="">All priorities</option>
              {TICKET_PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* category */}
          <div className="flex items-center gap-1.5">
            <Icon name="category" className="text-on-surface-variant/60 text-base" />
            <select
              value={filters.category}
              onChange={(e) => setFilter('category', e.target.value)}
              className={`${inputClass} pr-7 appearance-none cursor-pointer`}
            >
              <option value="">All categories</option>
              {TICKET_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* clear button — shown only when filters active */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm font-semibold text-error hover:bg-red-50 px-3 py-2 rounded-xl transition-colors font-body"
            >
              <Icon name="filter_list_off" className="text-base" />
              Clear
              <span className="w-5 h-5 rounded-full bg-error text-white text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            </button>
          )}
        </div>

        {/* active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-container-high">
            {filters.status && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-container border border-surface-container-high font-label">
                <TicketStatusBadge status={filters.status} />
                <button onClick={() => setFilter('status', '')} className="hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
            {filters.priority && (
              <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-surface-container border border-surface-container-high font-label">
                <TicketPriorityBadge priority={filters.priority} />
                <button onClick={() => setFilter('priority', '')} className="hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant border border-surface-container-high font-label">
                {TICKET_CATEGORY_OPTIONS.find(o => o.value === filters.category)?.label ?? filters.category}
                <button onClick={() => setFilter('category', '')} className="hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── TABLE (full width) ── */}
      {loading ? (
        <LoadingTicketsState />
      ) : items.length === 0 ? (
        <EmptyTicketsState />
      ) : (
        <>
          <TicketTable
            items={items}
            sortBy={sortBy}
            sortDir={sortDir}
            toggleSort={toggleSort}
            onDelete={handleDelete}
          />
          <TicketPaginationBar
            page={page}
            totalPages={totalPages}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalItems={totalItems}
            setPage={setPage}
          />
        </>
      )}
    </div>
  );
}
