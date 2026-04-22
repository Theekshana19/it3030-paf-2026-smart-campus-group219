import DashboardSummaryCard from './DashboardSummaryCard.jsx';

export default function DashboardSummaryCards({ overview, loading }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <DashboardSummaryCard
        label="Total Resources"
        value={overview?.totalResources ?? 0}
        icon="inventory"
        iconWrapClass="bg-primary/10"
        iconClass="text-primary"
        badge="+Live"
        badgeClass="bg-tertiary/10 text-tertiary"
        loading={loading}
      />
      <DashboardSummaryCard
        label="Active Resources"
        value={overview?.activeResources ?? 0}
        icon="check_circle"
        iconWrapClass="bg-tertiary/10"
        iconClass="text-tertiary"
        badge="Optimal"
        badgeClass="bg-secondary/10 text-secondary"
        loading={loading}
      />
      <DashboardSummaryCard
        label="Out of Service"
        value={overview?.outOfServiceResources ?? 0}
        icon="error"
        iconWrapClass="bg-error/10"
        iconClass="text-error"
        badge="High Alert"
        badgeClass="bg-error/10 text-error"
        loading={loading}
      />
      <DashboardSummaryCard
        label="Available Now"
        value={overview?.availableNowResources ?? 0}
        icon="event_available"
        iconWrapClass="bg-secondary-container"
        iconClass="text-on-secondary-fixed-variant"
        badge="Now"
        badgeClass="bg-primary/10 text-primary"
        loading={loading}
      />
    </section>
  );
}
