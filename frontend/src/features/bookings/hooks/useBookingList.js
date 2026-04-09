import { useCallback, useEffect, useMemo, useState } from 'react';
import * as bookingsApi from '../api/bookingsApi.js';

const defaultFilters = {
  resourceId: '',
  status: '',
  userEmail: '',
  dateFrom: '',
  dateTo: '',
  search: '',
};

// hook to manage booking list with filters and pagination
export function useBookingList() {
  const [filters, setFiltersState] = useState(() => ({ ...defaultFilters }));
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState('bookingDate');
  const [sortDir, setSortDir] = useState('desc');

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // debounce search input
  useEffect(() => {
    const id = setTimeout(() => {
      setFiltersState((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput };
      });
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  // reset page when search changes
  useEffect(() => {
    setPage(0);
  }, [filters.search]);

  // build query params from filters
  const queryParams = useMemo(() => {
    return {
      resourceId: filters.resourceId || undefined,
      status: filters.status || undefined,
      userEmail: filters.userEmail || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      search: filters.search || undefined,
      page,
      size,
      sortBy,
      sortDir,
    };
  }, [filters, page, size, sortBy, sortDir]);

  // fetch bookings from API
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.listBookings(queryParams);
      setList(data);
    } catch (e) {
      setError(e);
      setList(null);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    load();
  }, [load]);

  // update a single filter value
  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  // clear all filters
  const clearFilters = useCallback(() => {
    setFiltersState({ ...defaultFilters });
    setSearchInput('');
    setPage(0);
  }, []);

  const items = list?.items ?? [];
  const totalItems = list?.totalItems ?? 0;
  const totalPages = list?.totalPages ?? 0;

  const rangeStart = totalItems === 0 ? 0 : page * size + 1;
  const rangeEnd = Math.min((page + 1) * size, totalItems);

  // toggle sort direction or change sort field
  const toggleSort = useCallback(
    (field) => {
      if (sortBy === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortBy(field);
        setSortDir('asc');
      }
      setPage(0);
    },
    [sortBy]
  );

  return {
    filters,
    setFilter,
    clearFilters,
    searchInput,
    setSearchInput,
    page,
    setPage,
    size,
    sortBy,
    sortDir,
    toggleSort,
    items,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    loading,
    error,
    refetch: load,
  };
}
