import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ item: {title: string; timeLabel: string; description: string; actor?: string } }} props
 */
export default function RecentlyUpdatedScheduleCard({ item }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex items-start gap-4">
      <div className="w-10 h-10 rounded bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
        <Icon name="history" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between gap-4">
          <p className="text-sm font-bold">{item.title}</p>
          <span className="text-[10px] text-slate-400">{item.timeLabel}</span>
        </div>
        <p className="text-xs text-secondary mt-1">{item.description}</p>
        {item.actor ? <p className="text-[10px] font-medium text-slate-500 mt-3">Updated by {item.actor}</p> : null}
      </div>
    </div>
  );
}
