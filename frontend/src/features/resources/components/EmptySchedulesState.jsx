import Icon from '../../../components/common/Icon.jsx';

export default function EmptySchedulesState() {
  return (
    <div className="p-6">
      <div className="bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/50 p-8">
        <div className="max-w-md mx-auto flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center">
            <Icon name="calendar_month" className="text-4xl text-outline" />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface">No scheduled status changes found</p>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              There are no maintenance windows or status overrides scheduled for the selected date range.
            </p>
          </div>
          <button
            type="button"
            className="group inline-flex items-center text-primary font-bold text-xs tracking-tight transition-all"
          >
            <span className="bg-primary text-white p-2 rounded-lg mr-2 group-hover:shadow-lg transition-all">
              <Icon name="build" className="text-base" />
            </span>
            Schedule Maintenance
          </button>
        </div>
      </div>
    </div>
  );
}

