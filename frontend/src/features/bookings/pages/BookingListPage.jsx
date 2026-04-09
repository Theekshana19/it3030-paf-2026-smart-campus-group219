import { useCallback } from 'react';
import { toast } from 'sonner';
import { useBookingList } from '../hooks/useBookingList.js';
import * as bookingsApi from '../api/bookingsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import BookingListHeader from '../components/BookingListHeader.jsx';
import BookingFiltersPanel from '../components/BookingFiltersPanel.jsx';
import BookingTable from '../components/BookingTable.jsx';
import BookingPaginationBar from '../components/BookingPaginationBar.jsx';
import EmptyBookingsState from '../components/EmptyBookingsState.jsx';
import LoadingBookingsState from '../components/LoadingBookingsState.jsx';
import Icon from '../../../components/common/Icon.jsx';

// main booking list page with filters and table
export default function BookingListPage() {
  const {
    filters, setFilter, clearFilters,
    searchInput, setSearchInput,
    page, setPage, sortBy, sortDir, toggleSort,
    items, totalItems, totalPages, rangeStart, rangeEnd,
    loading, refetch,
  } = useBookingList();

  // handle delete booking with confirmation
  const handleDelete = useCallback(
    async (bookingId, bookingRef) => {
      const confirmed = await confirmDeleteAlert({
        title: 'Delete booking?',
        text: `Booking ${bookingRef} will be permanently removed.`,
      });
      if (!confirmed) return;
      try {
        await bookingsApi.deleteBooking(bookingId);
        toast.success('Booking deleted');
        refetch();
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    },
    [refetch]
  );

  return (
    <div className="p-8 md:p-10 max-w-7xl mx-auto">
      <BookingListHeader totalItems={totalItems} />

      {/* search bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by reference, purpose, or name..."
            className="w-full bg-surface-container-lowest border-none rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* filters sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <BookingFiltersPanel
            filters={filters}
            setFilter={setFilter}
            clearFilters={clearFilters}
          />
        </div>

        {/* main content */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingBookingsState />
          ) : items.length === 0 ? (
            <EmptyBookingsState />
          ) : (
            <>
              <BookingTable
                items={items}
                sortBy={sortBy}
                sortDir={sortDir}
                toggleSort={toggleSort}
                onDelete={handleDelete}
                onRefetch={refetch}
              />
              <BookingPaginationBar
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
