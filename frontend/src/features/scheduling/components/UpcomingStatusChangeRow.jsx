import Icon from '../../../components/common/Icon.jsx';
import ConflictIndicator from './ConflictIndicator.jsx';
import SchedulingStatusBadge from './SchedulingStatusBadge.jsx';

/**
 * @param {{ row: Record<string, any> }} props
 */
export default function UpcomingStatusChangeRow({ row }) {
  return (
    <tr className="hover:bg-surface-container-low transition-colors">
      <td className="px-6 py-5">
        <p className="font-semibold text-slate-900">{row.resourceName}</p>
        <p className="text-xs text-secondary mt-0.5">{row.resourceCode}</p>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm">{row.locationLabel || row.building}</p>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm font-medium">{row.scheduleDateLabel}</p>
        <p className="text-xs text-secondary">{row.timeRangeLabel}</p>
      </td>
      <td className="px-6 py-5">
        <SchedulingStatusBadge status={row.targetStatus} />
      </td>
      <td className="px-6 py-5">
        <ConflictIndicator hasConflict={row.hasConflict} />
      </td>
      <td className="px-6 py-5 text-right">
        <button type="button" className="p-2 hover:bg-white rounded-full transition-colors" aria-label="Row actions">
          <Icon name="more_vert" className="text-slate-400" />
        </button>
      </td>
    </tr>
  );
}
