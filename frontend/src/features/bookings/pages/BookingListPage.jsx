import { useCallback } from 'react';
import { toast } from 'sonner';
import { useBookingList } from '../hooks/useBookingList.js';
import * as bookingsApi from '../api/bookingsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import { BOOKING_STATUS_OPTIONS } from '../types/booking.types.js';
import BookingListHeader from '../components/BookingListHeader.jsx';
import BookingTable from '../components/BookingTable.jsx';
import BookingPaginationBar from '../components/BookingPaginationBar.jsx';
import EmptyBookingsState from '../components/EmptyBookingsState.jsx';
import LoadingBookingsState from '../components/LoadingBookingsState.jsx';
import BookingStatusBadge from '../components/BookingStatusBadge.jsx';
import Icon from '../../../components/common/Icon.jsx';

const inputClass =
  'bg-surface-container-lowest border border-surface-container-high rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-body outline-none shadow-sm';

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

  const hasActiveFilters = filters.status || filters.dateFrom || filters.dateTo || filters.userEmail;
  const showClearButton = hasActiveFilters || !!searchInput;
  const activeFilterCount = [filters.status, filters.dateFrom, filters.dateTo, filters.userEmail, searchInput].filter(Boolean).length;

  return (
    <div className="p-6 md:p-8 w-full space-y-5">

      {/* gradient header banner */}
      <BookingListHeader totalItems={totalItems} />

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
              placeholder="Search by reference, purpose, or name..."
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
              {BOOKING_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* date from */}
          <div className="flex items-center gap-1.5">
            <Icon name="calendar_today" className="text-on-surface-variant/60 text-base" />
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilter('dateFrom', e.target.value)}
              className={`${inputClass} cursor-pointer`}
              title="Date from"
            />
          </div>

          {/* date to */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-on-surface-variant font-body">to</span>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilter('dateTo', e.target.value)}
              className={`${inputClass} cursor-pointer`}
              title="Date to"
            />
          </div>

          {/* email */}
          <div className="flex items-center gap-1.5">
            <Icon name="person" className="text-on-surface-variant/60 text-base" />
            <input
              type="text"
              value={filters.userEmail}
              onChange={(e) => setFilter('userEmail', e.target.value)}
              placeholder="Filter by email..."
              className={`${inputClass} w-40`}
            />
          </div>

          {/* clear button — shown when any filter or search is active */}
          {showClearButton && (
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
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label">
                <BookingStatusBadge status={filters.status} />
                <button onClick={() => setFilter('status', '')} className="ml-1 hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
            {filters.dateFrom && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label">
                From: {filters.dateFrom}
                <button onClick={() => setFilter('dateFrom', '')} className="ml-1 hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
            {filters.dateTo && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label">
                To: {filters.dateTo}
                <button onClick={() => setFilter('dateTo', '')} className="ml-1 hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
            {filters.userEmail && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label">
                Email: {filters.userEmail}
                <button onClick={() => setFilter('userEmail', '')} className="ml-1 hover:text-error transition-colors">
                  <Icon name="close" className="text-xs" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── TABLE (full width) ── */}
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
  );
}
