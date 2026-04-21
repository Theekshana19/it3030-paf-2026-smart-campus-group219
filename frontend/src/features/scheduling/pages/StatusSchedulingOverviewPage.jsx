import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { getErrorMessage } from '../../../services/httpClient.js';
import { deleteGlobalSchedule, getSchedulingOverviewBundle } from '../api/schedulingService.js';
import SchedulingOverviewHeader from '../components/SchedulingOverviewHeader.jsx';
import SchedulingSummaryCards from '../components/SchedulingSummaryCards.jsx';
import SchedulingFiltersBar from '../components/SchedulingFiltersBar.jsx';
import UpcomingStatusChangesTable from '../components/UpcomingStatusChangesTable.jsx';
import TodayTimelineOverviewCard from '../components/TodayTimelineOverviewCard.jsx';
import PriorityAlertsCard from '../components/PriorityAlertsCard.jsx';
import QuickActionsCard from '../components/QuickActionsCard.jsx';
import RecentlyUpdatedSchedulesSection from '../components/RecentlyUpdatedSchedulesSection.jsx';
import CreateScheduleDrawer from '../components/CreateScheduleDrawer.jsx';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';

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
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [deletingScheduleId, setDeletingScheduleId] = useState(null);

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

  const handleEditSchedule = useCallback((row) => {
    setEditingSchedule(row);
    setIsCreateDrawerOpen(true);
  }, []);

  const handleDeleteSchedule = useCallback(
    async (row) => {
      const confirmed = await confirmDeleteAlert({
        title: 'Delete schedule?',
        text: `This will remove the schedule for ${row.resourceName}.`,
      });
      if (!confirmed) return;
      setDeletingScheduleId(row.scheduleId);
      try {
        await deleteGlobalSchedule({ resourceId: row.resourceId, scheduleId: row.scheduleId });
        toast.success('Schedule deleted successfully');
        await load();
      } catch (e) {
        toast.error(getErrorMessage(e));
      } finally {
        setDeletingScheduleId(null);
      }
    },
    [load]
  );

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
          <UpcomingStatusChangesTable
            rows={data.items}
            loading={loading}
            onEdit={handleEditSchedule}
            onDelete={handleDeleteSchedule}
            deletingScheduleId={deletingScheduleId}
          />
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
        onClose={() => {
          setIsCreateDrawerOpen(false);
          setEditingSchedule(null);
        }}
        onCreated={async () => {
          await load();
          setEditingSchedule(null);
        }}
        initialSchedule={editingSchedule}
      />
    </div>
  );
}
