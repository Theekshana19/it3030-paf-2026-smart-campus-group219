import { RESOURCE_TYPES } from '../types/resource.types.js';
import SmartAvailabilityBadge from './SmartAvailabilityBadge.jsx';
import ResourceTagChip from './ResourceTagChip.jsx';
import ResourceTableActions from './ResourceTableActions.jsx';

function typeLabel(value) {
  return RESOURCE_TYPES.find((t) => t.value === value)?.label ?? value ?? '—';
}

function locationLine(row) {
  const parts = [row.building, row.roomOrAreaIdentifier, row.floor].filter(Boolean);
  return parts.length ? parts.join(' · ') : '—';
}

const MAX_TAGS = 4;

/**
 * @param {{ row: import('../types/resource.types.js').ResourceListItem; onDelete: (id: number) => void; deleteBusy?: boolean }} props
 */
export default function ResourceTableRow({ row, onDelete, deleteBusy = false }) {
  const tags = row.tags ?? [];
  const shown = tags.slice(0, MAX_TAGS);
  const extra = tags.length - shown.length;

  return (
    <tr className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/80 transition-colors duration-150">
      <td className="py-4 px-4 pl-5 align-top">
        <div className="min-w-[10rem]">
          <p className="font-headline font-bold text-sm text-on-surface leading-snug">{row.resourceName}</p>
          <p className="text-xs font-mono text-on-surface-variant mt-0.5">{row.resourceCode}</p>
        </div>
      </td>
      <td className="py-4 px-3 align-top text-sm font-medium text-on-surface whitespace-nowrap">
        {typeLabel(row.resourceType)}
      </td>
      <td className="py-4 px-3 align-top text-sm text-on-surface tabular-nums">
        {row.capacity != null ? row.capacity : '—'}
      </td>
      <td className="py-4 px-3 align-top text-sm text-on-surface-variant max-w-[14rem]">
        <span className="line-clamp-2">{locationLine(row)}</span>
      </td>
      <td className="py-4 px-3 align-top">
        <SmartAvailabilityBadge
          status={row.smartAvailabilityStatus}
          nextBookingTime={row.nextBookingTime}
        />
      </td>
      <td className="py-4 px-3 align-top">
        <div className="flex flex-wrap gap-1.5 max-w-[12rem]">
          {shown.map((t) => (
            <ResourceTagChip key={t.tagId} label={t.tagName} />
          ))}
          {extra > 0 ? (
            <span className="text-[10px] font-bold text-on-surface-variant self-center">+{extra}</span>
          ) : null}
        </div>
      </td>
      <td className="py-4 px-3 pr-5 align-top text-right">
        <ResourceTableActions resourceId={row.resourceId} onDelete={onDelete} disabled={deleteBusy} />
      </td>
    </tr>
  );
}
