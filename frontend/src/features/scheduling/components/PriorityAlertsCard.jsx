import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ alerts: Array<{id: string; level: string; title: string; message: string; actionLabel?: string}>; loading?: boolean }} props
 */
export default function PriorityAlertsCard({ alerts, loading = false }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_32px_rgba(23,28,31,0.04)] border border-white">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="notification_important" className="text-error" />
        <h2 className="text-base font-bold font-manrope">Priority Alerts</h2>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 bg-surface-container rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-r-lg border-l-4 ${
                alert.level === 'high' ? 'bg-red-50 border-error' : 'bg-amber-50 border-amber-500'
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider">{alert.title}</p>
              <p className="text-sm font-medium text-slate-900 mt-1">{alert.message}</p>
              {alert.actionLabel ? <button className="mt-2 text-xs font-bold text-error underline">{alert.actionLabel}</button> : null}
            </div>
          ))}
          {alerts.length === 0 ? <p className="text-sm text-on-surface-variant">No critical alerts right now.</p> : null}
        </div>
      )}
    </div>
  );
}
