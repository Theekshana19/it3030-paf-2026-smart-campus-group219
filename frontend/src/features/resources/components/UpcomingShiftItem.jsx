import Icon from '../../../components/common/Icon.jsx';
import ScheduleStatusBadge from './ScheduleStatusBadge.jsx';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(`${d}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

/**
 * @param {{
 *   shift: Record<string, any>;
 *   onDelete?: (scheduleId: number) => void;
 *   deleting?: boolean;
 *   onSelectShift?: (shift: Record<string, any>) => void;
 * }} props
 */
export default function UpcomingShiftItem({ shift, onDelete, deleting = false, onSelectShift }) {
  return (
    <div
      className="p-5 hover:bg-surface-container transition-colors group cursor-pointer"
      onClick={() => {
        if (onSelectShift) onSelectShift(shift);
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <ScheduleStatusBadge status={shift.scheduledStatus} />
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" className="p-1 hover:text-primary transition-colors" title="Edit (coming soon)">
            <Icon name="edit" className="text-lg" />
          </button>
          <button
            type="button"
            className="p-1 hover:text-error transition-colors disabled:opacity-50"
            onClick={() => onDelete?.(shift.scheduleId)}
            disabled={deleting}
            title="Delete schedule"
          >
            <Icon name="delete" className="text-lg" />
          </button>
        </div>
      </div>

      <h4 className="text-sm font-bold text-on-surface mb-1">
        {shift.reasonNote?.trim() || 'Scheduled status change'}
      </h4>
      <p className="text-xs text-on-surface-variant flex items-center gap-2 mb-3">
        <Icon name="calendar_month" className="text-sm" /> {fmtDate(shift.scheduleDate)}
        <Icon name="schedule" className="text-sm" /> {String(shift.startTime || '').slice(0, 5)} -{' '}
        {String(shift.endTime || '').slice(0, 5)}
      </p>

      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-surface-container-high flex items-center justify-center">
          <Icon name="person" className="text-[14px] text-on-surface-variant" />
        </div>
        <span className="text-[10px] font-medium text-on-surface-variant">
          Created {shift.createdAt ? new Date(shift.createdAt).toLocaleString() : 'just now'}
        </span>
      </div>
    </div>
  );
}

