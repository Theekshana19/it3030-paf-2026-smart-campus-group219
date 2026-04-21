import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getErrorMessage } from '../../../services/httpClient.js';
import { getSchedulingOverviewBundle } from '../api/schedulingService.js';
import SchedulingOverviewHeader from '../components/SchedulingOverviewHeader.jsx';
import SchedulingSummaryCards from '../components/SchedulingSummaryCards.jsx';
import SchedulingFiltersBar from '../components/SchedulingFiltersBar.jsx';
import UpcomingStatusChangesTable from '../components/UpcomingStatusChangesTable.jsx';
import TodayTimelineOverviewCard from '../components/TodayTimelineOverviewCard.jsx';
import PriorityAlertsCard from '../components/PriorityAlertsCard.jsx';
import QuickActionsCard from '../components/QuickActionsCard.jsx';
import RecentlyUpdatedSchedulesSection from '../components/RecentlyUpdatedSchedulesSection.jsx';
import CreateScheduleDrawer from '../components/CreateScheduleDrawer.jsx';

const defaultFilters = {
  search: '',
  resourceType: '',
  building: '',
  status: '',
  fromDate: '',
  toDate: '',
};

export default function StatusSchedulingOverviewPage() {
  const [filters, setFilters] = useState(defaultFilters);
  const [data, setData] = useState({
    items: [],
    metrics: null,
    timeline: [],
    alerts: [],
    recentUpdates: [],
    supportsGlobalOverview: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const next = await getSchedulingOverviewBundle(filters);
      setData(next);
    } catch (e) {
      const message = getErrorMessage(e);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  const filterOptions = useMemo(() => {
    const resourceTypes = [...new Set(data.items.map((r) => r.resourceType).filter(Boolean))];
    const buildings = [...new Set(data.items.map((r) => r.building).filter(Boolean))];
    const statuses = [...new Set(data.items.map((r) => r.targetStatus).filter(Boolean))];
    return { resourceTypes, buildings, statuses };
  }, [data.items]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => setFilters(defaultFilters), []);

  const handleRemoveFilter = useCallback((key) => {
    setFilters((prev) => {
      if (key === 'dateRange') return { ...prev, fromDate: '', toDate: '' };
      return { ...prev, [key]: '' };
    });
  }, []);

  return (
    <div className="p-8 space-y-8">
      <SchedulingOverviewHeader
        onCreate={() => setIsCreateDrawerOpen(true)}
        onExport={() => toast.message('Export generation can be connected to CSV endpoint.')}
      />

      {!data.supportsGlobalOverview ? (
        <div className="px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm border border-amber-200">
          Global scheduling endpoint is not available yet. Showing aggregated data from resource schedule APIs.
        </div>
      ) : null}

      <SchedulingSummaryCards metrics={data.metrics} loading={loading} />

      <SchedulingFiltersBar
        filters={filters}
        options={filterOptions}
        onChange={handleFilterChange}
        onClearAll={handleClearAll}
        onRemoveFilter={handleRemoveFilter}
      />

      {error ? (
        <div className="rounded-xl bg-error-container text-on-error-container px-6 py-5 flex items-center justify-between">
          <span className="font-medium">{error}</span>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-error text-on-error text-sm font-semibold"
            onClick={load}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <UpcomingStatusChangesTable rows={data.items} loading={loading} />
          <RecentlyUpdatedSchedulesSection items={data.recentUpdates || []} loading={loading} />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <TodayTimelineOverviewCard items={data.timeline || []} loading={loading} />
          <PriorityAlertsCard alerts={data.alerts || []} loading={loading} />
          <QuickActionsCard />
        </div>
      </div>

      <CreateScheduleDrawer
        open={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
