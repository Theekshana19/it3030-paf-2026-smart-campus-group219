import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *  onEdit: () => void;
 *  onSchedule: () => void;
 *  onViewBookings: () => void;
 *  onDelete: () => void;
 *  deleting?: boolean;
 * }} props
 */
export default function ResourceActionsBar({
  onEdit,
  onSchedule,
  onViewBookings,
  onDelete,
  deleting = false,
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest text-secondary font-manrope text-sm font-semibold shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] hover:bg-surface-container transition-all"
      >
        <Icon name="edit" className="text-lg" /> Edit
      </button>
      <button
        type="button"
        onClick={onSchedule}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-container-lowest text-secondary font-manrope text-sm font-semibold shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] hover:bg-surface-container transition-all"
      >
        <Icon name="calendar_month" className="text-lg" /> Schedule Status
      </button>
      <button
        type="button"
        onClick={onViewBookings}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-manrope text-sm font-semibold shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] hover:bg-primary-container transition-all"
      >
        <Icon name="visibility" className="text-lg" /> View Bookings
      </button>
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        className="p-2.5 rounded-xl bg-error-container text-error hover:bg-error/10 transition-all disabled:opacity-50"
      >
        <Icon name="delete" />
      </button>
    </div>
  );
}

