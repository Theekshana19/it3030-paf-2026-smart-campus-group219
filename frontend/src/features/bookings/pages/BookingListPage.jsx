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

export default function BookingListPage() {
  const {
    filters, setFilter, clearFilters,
    searchInput, setSearchInput,
    page, setPage, sortBy, sortDir, toggleSort,
    items, totalItems, totalPages, rangeStart, rangeEnd,
    loading, refetch,
  } = useBookingList();

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
    <div className="p-6 md:p-8 max-w-screen-xl mx-auto">
      <BookingListHeader totalItems={totalItems} />

      <div className="flex gap-6 items-start">
        {/* filters sidebar */}
        <div className="hidden lg:block w-60 flex-shrink-0 sticky top-6">
          <BookingFiltersPanel
            filters={filters}
            setFilter={setFilter}
            clearFilters={clearFilters}
          />
        </div>

        {/* main content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* search bar */}
          <div className="relative">
            <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-lg" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by reference, purpose, or name..."
              className="w-full bg-surface-container-lowest border border-surface-container-high rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-body outline-none shadow-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface transition-colors"
              >
                <Icon name="close" className="text-lg" />
              </button>
            )}
          </div>

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
