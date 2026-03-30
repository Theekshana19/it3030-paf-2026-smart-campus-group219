import Icon from '../../../components/common/Icon.jsx';
import ResourceTableRow from './ResourceTableRow.jsx';
import LoadingResourcesState from './LoadingResourcesState.jsx';
import EmptyResourcesState from './EmptyResourcesState.jsx';

const SORTABLE = [
  { key: 'resourceName', label: 'Resource' },
  { key: 'resourceType', label: 'Type' },
  { key: 'capacity', label: 'Capacity' },
  { key: 'building', label: 'Location' },
];

/**
 * @param {{
 *   rows: import('../types/resource.types.js').ResourceListItem[];
 *   loading: boolean;
 *   sortBy: string;
 *   sortDir: string;
 *   onSort: (field: string) => void;
 *   onDelete: (id: number) => void;
 *   deleteBusyId?: number | null;
 * }} props
 */
export default function ResourceTable({
  rows,
  loading,
  sortBy,
  sortDir,
  onSort,
  onDelete,
  deleteBusyId = null,
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left border-collapse">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/20">
              {SORTABLE.map(({ key, label }) => {
                const active = sortBy === key;
                return (
                  <th key={key} className="py-4 px-4 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label first:pl-5">
                    <button
                      type="button"
                      onClick={() => onSort(key)}
                      className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      {label}
                      {active ? (
                        <Icon
                          name={sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                          className="text-sm text-primary"
                        />
                      ) : (
                        <Icon name="unfold_more" className="text-base text-outline-variant/50" />
                      )}
                    </button>
                  </th>
                );
              })}
              <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label">
                Smart availability
              </th>
              <th className="py-4 px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label">
                Tags
              </th>
              <th className="py-4 px-3 pr-5 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-label text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface-container-lowest">
            {loading ? (
              <LoadingResourcesState />
            ) : rows.length === 0 ? (
              <EmptyResourcesState />
            ) : (
              rows.map((row) => (
                <ResourceTableRow
                  key={row.resourceId}
                  row={row}
                  onDelete={onDelete}
                  deleteBusy={deleteBusyId === row.resourceId}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
