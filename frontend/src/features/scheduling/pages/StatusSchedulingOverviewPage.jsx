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
import BulkStatusUpdateDrawer from '../components/BulkStatusUpdateDrawer.jsx';
import EmergencyOverrideDrawer from '../components/EmergencyOverrideDrawer.jsx';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import { exportScheduleListAsCsv } from '../utils/exportScheduleListCsv.js';

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
  const [isBulkDrawerOpen, setIsBulkDrawerOpen] = useState(false);
  const [isEmergencyDrawerOpen, setIsEmergencyDrawerOpen] = useState(false);
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

  const loadSilent = useCallback(async () => {
    try {
      const next = await getSchedulingOverviewBundle(filters);
      setData(next);
    } catch {
      /* keep last good snapshot; avoid toasts on background poll */
    }
  }, [filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const anyDrawerOpen = isCreateDrawerOpen || isBulkDrawerOpen || isEmergencyDrawerOpen;
    if (anyDrawerOpen) return undefined;
    const id = setInterval(() => {
      loadSilent();
    }, 30000);
    return () => clearInterval(id);
  }, [loadSilent, isCreateDrawerOpen, isBulkDrawerOpen, isEmergencyDrawerOpen]);

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

  const handleExportScheduleList = useCallback(() => {
    if (loading) {
      toast.message('Please wait until the schedule list finishes loading.');
      return;
    }
    if (!data.items?.length) {
      toast.message('No schedules to export for the current filters.');
      return;
    }
    try {
      exportScheduleListAsCsv(data.items);
      toast.success(`Exported ${data.items.length} row(s) to CSV.`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  }, [data.items, loading]);

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
        onExport={handleExportScheduleList}
      />

      {!data.supportsGlobalOverview ? (
        <div className="px-4 py-3 rounded-lg bg-amber-50 text-amber-700 text-sm border border-amber-200">
          Degraded mode: global overview endpoint is unavailable. Showing an approximate aggregation from
          resource schedule APIs.
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
          <QuickActionsCard
            onBulkStatusUpdate={() => setIsBulkDrawerOpen(true)}
            onEmergencyOverride={() => setIsEmergencyDrawerOpen(true)}
          />
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

      <BulkStatusUpdateDrawer
        open={isBulkDrawerOpen}
        onClose={() => setIsBulkDrawerOpen(false)}
        onSuccess={load}
      />
      <EmergencyOverrideDrawer
        open={isEmergencyDrawerOpen}
        onClose={() => setIsEmergencyDrawerOpen(false)}
        onSuccess={load}
      />
    </div>
  );
}
