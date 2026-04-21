import httpClient from '../../../services/httpClient.js';
import { listResources, listResourceStatusSchedules } from '../../resources/api/resourcesApi.js';

const GLOBAL_OVERVIEW_ENDPOINT = '/api/status-schedules/overview';

function toMinutes(timeValue) {
  const value = String(timeValue || '').slice(0, 5);
  if (!value.includes(':')) return 0;
  const [hh, mm] = value.split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function toTimeLabel(timeValue) {
  const value = String(timeValue || '').slice(0, 5);
  if (!value.includes(':')) return '--:--';
  const [hh, mm] = value.split(':').map(Number);
  const period = hh >= 12 ? 'PM' : 'AM';
  const hours12 = hh % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${String(mm).padStart(2, '0')} ${period}`;
}

function toDateLabel(dateValue) {
  if (!dateValue) return '-';
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(date);
}

function dateKey(value) {
  return String(value || '');
}

function withParams(filters = {}) {
  const out = {};
  const keys = ['search', 'resourceType', 'building', 'status', 'fromDate', 'toDate', 'page', 'size', 'sortBy', 'sortDir'];
  keys.forEach((key) => {
    const value = filters[key];
    if (value === undefined || value === null || value === '') return;
    out[key] = value;
  });
  return out;
}

function applyFilters(rows, filters = {}) {
  return rows.filter((row) => {
    if (filters.search) {
      const needle = String(filters.search).toLowerCase();
      const haystack = `${row.resourceName} ${row.resourceCode} ${row.building}`.toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    if (filters.resourceType && row.resourceType !== filters.resourceType) return false;
    if (filters.building && row.building !== filters.building) return false;
    if (filters.status && row.targetStatus !== filters.status) return false;
    if (filters.fromDate && dateKey(row.scheduleDate) < dateKey(filters.fromDate)) return false;
    if (filters.toDate && dateKey(row.scheduleDate) > dateKey(filters.toDate)) return false;
    return true;
  });
}

function addConflictSignals(rows) {
  const byResourceDate = new Map();
  rows.forEach((row) => {
    const key = `${row.resourceId}:${row.scheduleDate}`;
    const arr = byResourceDate.get(key) || [];
    arr.push(row);
    byResourceDate.set(key, arr);
  });
  byResourceDate.forEach((group) => {
    group.sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
    for (let i = 1; i < group.length; i += 1) {
      const prev = group[i - 1];
      const cur = group[i];
      if (toMinutes(cur.startTime) < toMinutes(prev.endTime)) {
        prev.hasConflict = true;
        cur.hasConflict = true;
      }
    }
  });
  return rows;
}

function toScheduleRow(resource, schedule) {
  return {
    scheduleId: schedule.scheduleId,
    resourceId: resource.resourceId,
    resourceName: resource.resourceName,
    resourceCode: resource.resourceCode,
    resourceType: resource.resourceType,
    building: resource.building || 'Unknown building',
    locationLabel: [resource.building, resource.floor, resource.roomOrAreaIdentifier].filter(Boolean).join(', '),
    scheduleDate: String(schedule.scheduleDate || ''),
    scheduleDateLabel: toDateLabel(schedule.scheduleDate),
    startTime: String(schedule.startTime || '').slice(0, 5),
    endTime: String(schedule.endTime || '').slice(0, 5),
    timeRangeLabel: `${toTimeLabel(schedule.startTime)} - ${toTimeLabel(schedule.endTime)}`,
    targetStatus: String(schedule.scheduledStatus || '').toUpperCase(),
    reasonNote: schedule.reasonNote || '',
    isActive: schedule.isActive !== false,
    updatedAt: schedule.updatedAt || schedule.createdAt || null,
    hasConflict: false,
  };
}

async function loadFallbackOverviewRows() {
  const resourcesResponse = await listResources({ page: 0, size: 100, sortBy: 'updatedAt', sortDir: 'desc' });
  const resources = Array.isArray(resourcesResponse?.items) ? resourcesResponse.items : [];
  const settled = await Promise.allSettled(resources.map((resource) => listResourceStatusSchedules(resource.resourceId)));
  const rows = [];
  settled.forEach((result, index) => {
    if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return;
    const resource = resources[index];
    result.value.forEach((schedule) => {
      rows.push(toScheduleRow(resource, schedule));
    });
  });
  rows.sort((a, b) => {
    const aKey = `${a.scheduleDate} ${a.startTime}`;
    const bKey = `${b.scheduleDate} ${b.startTime}`;
    return aKey.localeCompare(bKey);
  });
  return addConflictSignals(rows);
}

function metricsFromRows(rows) {
  const today = new Date().toISOString().slice(0, 10);
  const scheduledToday = rows.filter((r) => r.scheduleDate === today).length;
  const upcomingMaintenance = rows.filter((r) => r.targetStatus === 'OUT_OF_SERVICE' && r.scheduleDate >= today).length;
  const outOfService = rows.filter((r) => r.targetStatus === 'OUT_OF_SERVICE').length;
  const conflictsDetected = rows.filter((r) => r.hasConflict).length;
  return { scheduledToday, upcomingMaintenance, outOfService, conflictsDetected };
}

function timelineFromRows(rows) {
  const today = new Date().toISOString().slice(0, 10);
  return rows
    .filter((r) => r.scheduleDate === today)
    .sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))
    .slice(0, 6)
    .map((r) => ({
      id: `${r.scheduleId}-${r.resourceId}`,
      time: toTimeLabel(r.startTime),
      title: `${r.resourceName} ${r.targetStatus === 'OUT_OF_SERVICE' ? 'Maintenance Start' : 'Status Change'}`,
      subtitle: r.reasonNote || r.locationLabel || 'Campus operation update',
      active: r.hasConflict,
    }));
}

function alertsFromRows(rows) {
  const items = [];
  rows.forEach((row) => {
    if (row.hasConflict) {
      items.push({
        id: `conflict-${row.scheduleId}`,
        level: 'high',
        title: 'Booking Conflict',
        message: `${row.resourceName} has overlapping windows on ${row.scheduleDateLabel}.`,
        actionLabel: 'Resolve now',
      });
    }
    if (row.targetStatus === 'OUT_OF_SERVICE' && !row.reasonNote) {
      items.push({
        id: `staff-${row.scheduleId}`,
        level: 'medium',
        title: 'Missing context',
        message: `${row.resourceName} is marked out of service without a reason note.`,
      });
    }
  });
  return items.slice(0, 4);
}

function recentFromRows(rows) {
  return [...rows]
    .filter((r) => r.updatedAt)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
    .slice(0, 4)
    .map((row) => ({
      id: `recent-${row.scheduleId}`,
      title: `${row.targetStatus === 'OUT_OF_SERVICE' ? 'Modified' : 'Updated'}: ${row.resourceName}`,
      timeLabel: row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '',
      description: row.reasonNote || `${row.scheduleDateLabel} ${row.timeRangeLabel}`,
      actor: 'System update',
    }));
}

async function loadOverview(filters = {}) {
  try {
    const { data } = await httpClient.get(GLOBAL_OVERVIEW_ENDPOINT, { params: withParams(filters) });
    return {
      items: Array.isArray(data?.items) ? data.items : [],
      metrics: data?.metrics || null,
      timeline: Array.isArray(data?.timeline) ? data.timeline : [],
      alerts: Array.isArray(data?.alerts) ? data.alerts : [],
      recentUpdates: Array.isArray(data?.recentUpdates) ? data.recentUpdates : [],
      supportsGlobalOverview: true,
      source: 'global-endpoint',
    };
  } catch (error) {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message || error?.message || '').toLowerCase();
    const endpointUnavailable = status === 404 || message.includes('no static resource') || message.includes('not found');
    if (!endpointUnavailable) throw error;

    const allRows = await loadFallbackOverviewRows();
    const filtered = applyFilters(allRows, filters);
    return {
      items: filtered,
      metrics: metricsFromRows(filtered),
      timeline: timelineFromRows(filtered),
      alerts: alertsFromRows(filtered),
      recentUpdates: recentFromRows(filtered),
      supportsGlobalOverview: false,
      source: 'fallback-resource-aggregation',
    };
  }
}

export async function getSchedulingOverviewBundle(filters = {}) {
  return loadOverview(filters);
}

export async function listGlobalSchedules(filters = {}) {
  const data = await loadOverview(filters);
  return {
    items: data.items,
    totalItems: data.items.length,
    supportsGlobalOverview: data.supportsGlobalOverview,
    source: data.source,
  };
}

export async function getSchedulingOverviewMetrics(filters = {}) {
  const data = await loadOverview(filters);
  return data.metrics || metricsFromRows(data.items);
}

export async function getTodayTimeline(filters = {}) {
  const data = await loadOverview(filters);
  return data.timeline;
}

export async function getPriorityAlerts(filters = {}) {
  const data = await loadOverview(filters);
  return data.alerts;
}

export async function getRecentScheduleUpdates(filters = {}) {
  const data = await loadOverview(filters);
  return data.recentUpdates;
}
