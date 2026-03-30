import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useResourceCatalogue } from '../hooks/useResourceCatalogue.js';
import * as resourcesApi from '../api/resourcesApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import ResourceListHeader from '../components/ResourceListHeader.jsx';
import ResourceFiltersPanel from '../components/ResourceFiltersPanel.jsx';
import ActiveFilterChips from '../components/ActiveFilterChips.jsx';
import ResourceTable from '../components/ResourceTable.jsx';
import PaginationControls from '../components/PaginationControls.jsx';
import CatalogueFooter from '../components/CatalogueFooter.jsx';

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/**
 * @param {import('../types/resource.types.js').ResourceListItem[]} rows
 */
function exportResourcesCsv(rows) {
  const headers = [
    'resourceName',
    'resourceCode',
    'resourceType',
    'capacity',
    'building',
    'floor',
    'room',
    'smartAvailability',
    'tags',
  ];
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        csvEscape(r.resourceName),
        csvEscape(r.resourceCode),
        csvEscape(r.resourceType),
        csvEscape(r.capacity),
        csvEscape(r.building),
        csvEscape(r.floor),
        csvEscape(r.roomOrAreaIdentifier),
        csvEscape(r.smartAvailabilityStatus),
        csvEscape((r.tags ?? []).map((t) => t.tagName).join('; ')),
      ].join(',')
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `campus-resources-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResourceCataloguePage() {
  const {
    filters,
    setFilter,
    clearFilters,
    searchInput,
    setSearchInput,
    page,
    setPage,
    sortBy,
    sortDir,
    toggleSort,
    onlyAvailableNow,
    setOnlyAvailableNow,
    displayItems,
    totalItems,
    totalPages,
    rangeStart,
    rangeEnd,
    loading,
    error,
    refetch,
    tagOptions,
    tagsLoading,
  } = useResourceCatalogue();

  const [deleteBusyId, setDeleteBusyId] = useState(null);

  const handleExport = useCallback(() => {
    if (!displayItems.length) {
      toast.message('Nothing to export on this view.');
      return;
    }
    exportResourcesCsv(displayItems);
    toast.success('Exported current table rows to CSV.');
  }, [displayItems]);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm('Delete this resource? This cannot be undone.')) return;
      setDeleteBusyId(id);
      try {
        await resourcesApi.deleteResource(id);
        toast.success('Resource deleted.');
        await refetch();
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setDeleteBusyId(null);
      }
    },
    [refetch]
  );

  const handleRemoveChip = useCallback(
    (key) => {
      if (key === 'search') setSearchInput('');
      setFilter(key, '');
    },
    [setFilter, setSearchInput]
  );

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-7 md:space-y-8">
      <ResourceListHeader onExport={handleExport} exportDisabled={loading || displayItems.length === 0} />

      <ResourceFiltersPanel
        filters={filters}
        searchInput={searchInput}
        onSearchInput={setSearchInput}
        onFilterChange={setFilter}
        onClearAll={clearFilters}
        tagOptions={tagOptions}
        tagsLoading={tagsLoading}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        totalItems={totalItems}
        onlyAvailableNow={onlyAvailableNow}
        onOnlyAvailableNowChange={setOnlyAvailableNow}
      />

      <ActiveFilterChips
        filters={filters}
        onlyAvailableNow={onlyAvailableNow}
        onRemove={handleRemoveChip}
        onClearAvailableNow={() => setOnlyAvailableNow(false)}
      />

      {error ? (
        <div
          className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-on-error-container font-body"
          role="alert"
        >
          {getErrorMessage(error)}{' '}
          <button type="button" className="font-bold underline ml-1" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : null}

      <ResourceTable
        rows={displayItems}
        loading={loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={toggleSort}
        onDelete={handleDelete}
        deleteBusyId={deleteBusyId}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading || !!error}
      />

      <CatalogueFooter />
    </div>
  );
}
