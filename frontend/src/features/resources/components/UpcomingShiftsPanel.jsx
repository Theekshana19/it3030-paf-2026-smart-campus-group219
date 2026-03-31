import Icon from '../../../components/common/Icon.jsx';
import EmptySchedulesState from './EmptySchedulesState.jsx';
import LoadingSchedulesState from './LoadingSchedulesState.jsx';
import UpcomingShiftItem from './UpcomingShiftItem.jsx';

/**
 * @param {{
 *   shifts: Record<string, any>[];
 *   loading?: boolean;
 *   onDelete?: (scheduleId: number) => void;
 *   deletingId?: number | null;
 *   onSelectShift?: (shift: Record<string, any>) => void;
 * }} props
 */
export default function UpcomingShiftsPanel({
  shifts,
  loading = false,
  onDelete,
  deletingId = null,
  onSelectShift,
}) {
  return (
    <section className="bg-white rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] overflow-hidden">
      <div className="p-6 border-b border-surface-container-low flex justify-between items-center">
        <h3 className="font-headline font-bold text-lg">Upcoming Shifts</h3>
        <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline" type="button">
          <Icon name="filter_list" className="text-sm" />
          Filter
        </button>
      </div>

      <div className="divide-y divide-surface-container-low">
        {loading ? (
          <LoadingSchedulesState />
        ) : shifts.length === 0 ? (
          <EmptySchedulesState />
        ) : (
          shifts.map((shift) => (
            <UpcomingShiftItem
              key={shift.scheduleId}
              shift={shift}
              onDelete={onDelete}
              deleting={deletingId === shift.scheduleId}
              onSelectShift={onSelectShift}
            />
          ))
        )}
      </div>

      <button
        className="w-full py-4 text-xs font-bold text-primary hover:bg-primary/5 transition-colors uppercase tracking-widest"
        type="button"
      >
        View Archive
      </button>
    </section>
  );
}

