import { useCallback } from 'react';
import { toast } from 'sonner';
import { useTicketList } from '../hooks/useTicketList.js';
import * as ticketsApi from '../api/ticketsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import TicketListHeader from '../components/TicketListHeader.jsx';
import TicketFiltersPanel from '../components/TicketFiltersPanel.jsx';
import TicketTable from '../components/TicketTable.jsx';
import TicketPaginationBar from '../components/TicketPaginationBar.jsx';
import EmptyTicketsState from '../components/EmptyTicketsState.jsx';
import LoadingTicketsState from '../components/LoadingTicketsState.jsx';
import Icon from '../../../components/common/Icon.jsx';

// this is the main page that shows all incident tickets
// admin can see every ticket, normal users see only their own tickets
// the table can be filtered by status, priority, and category
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

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <TicketListHeader totalItems={totalItems} />

      {/* search bar for searching tickets */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, description, or reference..."
            className="w-full bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* filter sidebar on the left */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <TicketFiltersPanel filters={filters} setFilter={setFilter} clearFilters={clearFilters} />
        </div>

        {/* main ticket table content */}
        <div className="flex-1 min-w-0">
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
      </div>
    </div>
  );
}
