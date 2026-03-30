import Icon from '../../../components/common/Icon.jsx';
import { RESOURCE_TYPES, OPERATIONAL_STATUS_OPTIONS } from '../types/resource.types.js';

/**
 * @param {{
 *   filters: Record<string, string>;
 *   onlyAvailableNow: boolean;
 *   onRemove: (key: string) => void;
 *   onClearAvailableNow: () => void;
 * }} props
 */
export default function ActiveFilterChips({ filters, onlyAvailableNow, onRemove, onClearAvailableNow }) {
  const chips = [];

  if (filters.type) {
    const label = RESOURCE_TYPES.find((t) => t.value === filters.type)?.label ?? filters.type;
    chips.push({ key: 'type', label: `Type: ${label}` });
  }
  if (filters.minCapacity !== '' && filters.minCapacity != null) {
    chips.push({ key: 'minCapacity', label: `Min capacity: ${filters.minCapacity}` });
  }
  if (filters.building) {
    chips.push({ key: 'building', label: `Building: ${filters.building}` });
  }
  if (filters.status) {
    const label =
      OPERATIONAL_STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status;
    chips.push({ key: 'status', label: `Status: ${label}` });
  }
  if (filters.tag) {
    chips.push({ key: 'tag', label: `Tag: ${filters.tag}` });
  }
  if (filters.search) {
    chips.push({ key: 'search', label: `Search: “${filters.search}”` });
  }

  if (chips.length === 0 && !onlyAvailableNow) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5 mt-1">
      {onlyAvailableNow ? (
        <span className="inline-flex items-center gap-1.5 pl-3.5 pr-2 py-2 rounded-full text-[10px] font-bold uppercase tracking-tight bg-emerald-500/12 text-emerald-800 border border-emerald-500/30">
          Available now
          <button
            type="button"
            onClick={onClearAvailableNow}
            className="p-0.5 rounded-full hover:bg-emerald-500/20"
            aria-label="Remove available now filter"
          >
            <Icon name="close" className="text-sm" />
          </button>
        </span>
      ) : null}
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1.5 pl-3.5 pr-2 py-2 rounded-full text-[10px] font-bold uppercase tracking-tight bg-surface-container text-secondary border border-outline-variant/25 shadow-sm"
        >
          {c.label}
          <button
            type="button"
            onClick={() => onRemove(c.key)}
            className="p-0.5 rounded-full hover:bg-surface-container-high"
            aria-label={`Remove ${c.label}`}
          >
            <Icon name="close" className="text-sm" />
          </button>
        </span>
      ))}
    </div>
  );
}
