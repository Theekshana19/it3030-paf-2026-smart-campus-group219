import SchedulingSummaryCard from './SchedulingSummaryCard.jsx';

/**
 * @param {{
 *  metrics?: {
 *    scheduledToday?: number;
 *    upcomingMaintenance?: number;
 *    outOfService?: number;
 *    conflictsDetected?: number;
 *  };
 *  loading?: boolean;
 * }} props
 */
export default function SchedulingSummaryCards({ metrics, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-xl animate-pulse">
            <div className="w-10 h-10 rounded-full bg-surface-container" />
            <div className="h-3 w-28 bg-surface-container rounded mt-4" />
            <div className="h-8 w-16 bg-surface-container rounded mt-3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SchedulingSummaryCard
        title="Scheduled Today"
        value={metrics?.scheduledToday ?? 0}
        note="Planned windows for the current day"
        icon="event_note"
        tone="primary"
      />
      <SchedulingSummaryCard
        title="Upcoming Maintenance"
        value={metrics?.upcomingMaintenance ?? 0}
        note="Future out-of-service windows"
        icon="build"
        tone="orange"
      />
      <SchedulingSummaryCard
        title="Out of Service"
        value={metrics?.outOfService ?? 0}
        note="Resources impacted by downtime"
        icon="report_off"
        tone="red"
      />
      <SchedulingSummaryCard
        title="Conflicts Detected"
        value={metrics?.conflictsDetected ?? 0}
        note="Manual review recommended"
        icon="query_stats"
        tone="amber"
      />
    </div>
  );
}
