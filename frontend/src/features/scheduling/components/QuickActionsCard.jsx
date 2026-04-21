import Icon from '../../../components/common/Icon.jsx';

export default function QuickActionsCard() {
  const actions = [
    { label: 'Bulk Status Update', icon: 'arrow_forward' },
    { label: 'Emergency Override', icon: 'lock_open' },
    { label: 'Resource Capacity Map', icon: 'map' },
  ];
  return (
    <div className="bg-indigo-900 text-white p-6 rounded-xl shadow-xl shadow-indigo-900/20">
      <h2 className="text-base font-bold font-manrope mb-4">Quick Actions</h2>
      <div className="space-y-2">
        {actions.map((action) => (
          <button
            type="button"
            key={action.label}
            className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-semibold group"
          >
            <span>{action.label}</span>
            <Icon name={action.icon} className="text-lg group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-500/30 flex items-center justify-center mb-3">
          <Icon name="bolt" className="text-indigo-200" />
        </div>
        <p className="text-xs text-indigo-100 leading-relaxed px-4">
          Use overrides only in critical infrastructure failures.
        </p>
      </div>
    </div>
  );
}
