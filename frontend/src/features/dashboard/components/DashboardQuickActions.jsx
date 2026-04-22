import Icon from '../../../components/common/Icon.jsx';

function QuickActionButton({ icon, label, iconClass, iconWrapClass, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-transparent bg-surface-container-low hover:border-primary/20 hover:bg-white transition-all group"
    >
      <span className="flex items-center gap-3">
        <span className={`p-2 rounded-lg ${iconWrapClass}`}>
          <Icon name={icon} className={iconClass} />
        </span>
        <span className="font-bold text-sm text-on-surface">{label}</span>
      </span>
      <Icon name="chevron_right" className="text-outline group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default function DashboardQuickActions({ onAddResource, onManageTags, onViewSchedule }) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)]">
      <h2 className="text-2xl font-headline font-bold mb-5">Quick Actions</h2>
      <div className="space-y-3">
        <QuickActionButton
          icon="add_circle"
          label="Add New Resource"
          iconClass="text-primary"
          iconWrapClass="bg-primary/10"
          onClick={onAddResource}
        />
        <QuickActionButton
          icon="sell"
          label="Manage Tags"
          iconClass="text-tertiary"
          iconWrapClass="bg-tertiary/10"
          onClick={onManageTags}
        />
        <QuickActionButton
          icon="calendar_month"
          label="View Full Schedule"
          iconClass="text-secondary"
          iconWrapClass="bg-secondary/10"
          onClick={onViewSchedule}
        />
      </div>
    </section>
  );
}
