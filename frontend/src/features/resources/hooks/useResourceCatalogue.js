import { useCallback, useEffect, useMemo, useState } from 'react';
import * as resourcesApi from '../api/resourcesApi.js';
import * as tagsApi from '../api/tagsApi.js';

const defaultFilters = {
  type: '',
  minCapacity: '',
  building: '',
  status: '',
  tag: '',
  search: '',
};

/**
 * Catalogue list: server filters + pagination + sort; optional client-side "Available now" on current page only.
 */
export function useResourceCatalogue() {
  const [filters, setFiltersState] = useState(() => ({ ...defaultFilters }));
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [sortBy, setSortBy] = useState('resourceName');
  const [sortDir, setSortDir] = useState('asc');
  const [onlyAvailableNow, setOnlyAvailableNow] = useState(false);

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [tagOptions, setTagOptions] = useState([]);
  const [tagsLoading, setTagsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setTagsLoading(true);
      try {
        const data = await tagsApi.listTags();
        if (!cancelled) setTagOptions(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setTagOptions([]);
      } finally {
        if (!cancelled) setTagsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setFiltersState((prev) => {
        if (prev.search === searchInput) return prev;
        return { ...prev, search: searchInput };
      });
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [filters.search]);

  const queryParams = useMemo(() => {
    const minCap = filters.minCapacity === '' ? undefined : Number(filters.minCapacity);
    return {
      type: filters.type || undefined,
      minCapacity: Number.isNaN(minCap) ? undefined : minCap,
      building: filters.building || undefined,
      status: filters.status || undefined,
      tag: filters.tag || undefined,
      search: filters.search || undefined,
      page,
      size,
      sortBy,
      sortDir,
    };
  }, [filters, page, size, sortBy, sortDir]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await resourcesApi.listResources(queryParams);
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

  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({ ...defaultFilters });
    setSearchInput('');
    setOnlyAvailableNow(false);
    setPage(0);
  }, []);

  const items = list?.items ?? [];
  const totalItems = list?.totalItems ?? 0;
  const totalPages = list?.totalPages ?? 0;

  /** Client-side filter on current API page only; full-catalog filter would need a backend param. */
  const displayItems = useMemo(() => {
    if (!onlyAvailableNow) return items;
    return items.filter((row) => row.smartAvailabilityStatus === 'AVAILABLE_NOW');
  }, [items, onlyAvailableNow]);

  const rangeStart = totalItems === 0 ? 0 : page * size + 1;
  const rangeEnd = Math.min((page + 1) * size, totalItems);

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
    onlyAvailableNow,
    setOnlyAvailableNow,
    items,
    displayItems,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    loading,
    error,
    refetch: load,
    tagOptions,
    tagsLoading,
  };
}
