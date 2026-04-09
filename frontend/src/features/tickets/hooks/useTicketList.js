import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ticketsApi from '../api/ticketsApi.js';

const defaultFilters = {
  status: '',
  priority: '',
  category: '',
  reporterEmail: '',
  assignedToEmail: '',
  search: '',
};

// this hook manages the ticket list data, filters, and pagination
// it fetches tickets from the API whenever filters or page changes
export function useTicketList() {
  const [filters, setFiltersState] = useState(() => ({ ...defaultFilters }));
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // debounce the search input so we don't call the API on every keystroke
  useEffect(() => {
    const timerId = setTimeout(() => {
      setFiltersState((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput };
      });
    }, 350);
    return () => clearTimeout(timerId);
  }, [searchInput]);

  // go back to page 1 when search text changes
  useEffect(() => {
    setPage(0);
  }, [filters.search]);

  // build the query parameters object from current filters
  const queryParams = useMemo(() => {
    return {
      status: filters.status || undefined,
      priority: filters.priority || undefined,
      category: filters.category || undefined,
      reporterEmail: filters.reporterEmail || undefined,
      assignedToEmail: filters.assignedToEmail || undefined,
      search: filters.search || undefined,
      page,
      size,
      sortBy,
      sortDir,
    };
  }, [filters, page, size, sortBy, sortDir]);

  // fetch the ticket list from the backend API
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ticketsApi.listTickets(queryParams);
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

  // update a single filter value and reset to first page
  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  // clear all filters and go back to first page
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

  // toggle sort direction or switch to a different sort field
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
    filters, setFilter, clearFilters,
    searchInput, setSearchInput,
    page, setPage, size,
    sortBy, sortDir, toggleSort,
    items, totalItems, totalPages, rangeStart, rangeEnd,
    loading, error, refetch: load,
  };
}
