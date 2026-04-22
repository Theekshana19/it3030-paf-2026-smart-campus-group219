import httpClient from '../../../services/httpClient.js';
import { listResources, listResourceStatusSchedules } from '../../resources/api/resourcesApi.js';

const GLOBAL_OVERVIEW_ENDPOINT = '/api/status-schedules/overview';

function toMinutes(timeValue) {
  const value = String(timeValue || '').slice(0, 5);
  if (!value.includes(':')) return 0;
  const [hh, mm] = value.split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

export function toBackendTime(timeValue) {
  const value = String(timeValue || '').trim();
  if (!value) return '';
  if (value.length === 5) return `${value}:00`;
  return value.slice(0, 8);
}

/** @param {string} scheduleDate @param {string} endTime HH:mm */
function scheduleEndAsDate(scheduleDate, endTime) {
  const d = String(scheduleDate || '').slice(0, 10);
  const t = toBackendTime(String(endTime || '').slice(0, 5)) || '23:59:59';
  return new Date(`${d}T${t}`);
}

/**
 * Half-open [start, end): effective OUT_OF_SERVICE only while now is inside the window.
 * Matches backend SmartAvailabilityService / overview logic.
 */
function effectiveOverviewTargetStatus(schedule) {
  const raw = String(schedule.scheduledStatus || '').toUpperCase();
  if (schedule.isActive === false) return raw;
  if (raw !== 'OUT_OF_SERVICE') return raw;
  const d = String(schedule.scheduleDate || '').slice(0, 10);
  if (!d) return raw;
  const startT = toBackendTime(String(schedule.startTime || '').slice(0, 5)) || '00:00:00';
  const endT = toBackendTime(String(schedule.endTime || '').slice(0, 5)) || '23:59:59';
  const startDt = new Date(`${d}T${startT}`);
  const endDt = new Date(`${d}T${endT}`);
  const now = Date.now();
  if (now >= startDt.getTime() && now < endDt.getTime()) return 'OUT_OF_SERVICE';
  if (now >= endDt.getTime()) return 'ACTIVE';
  return 'OUT_OF_SERVICE';
}

/** Default overview: hide past calendar days and today's windows that have ended. */
function isFallbackOverviewRowVisible(row) {
  const d = String(row.scheduleDate || '').slice(0, 10);
  if (!d) return true;
  const today = new Date().toISOString().slice(0, 10);
  if (d < today) return false;
  return Date.now() < scheduleEndAsDate(row.scheduleDate, row.endTime).getTime();
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
    targetStatus: effectiveOverviewTargetStatus(schedule),
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
    .filter((r) => Date.now() < scheduleEndAsDate(r.scheduleDate, r.endTime).getTime())
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

    let allRows = await loadFallbackOverviewRows();
    const hasDateRange = !!(filters.fromDate || filters.toDate);
    if (!hasDateRange) {
      allRows = allRows.filter(isFallbackOverviewRowVisible);
    }
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

export async function listDrawerResources(query = '') {
  const { items = [] } = await listResources({
    page: 0,
    size: 100,
    sortBy: 'resourceName',
    sortDir: 'asc',
    search: query || undefined,
  });
  return items.map((resource) => ({
    resourceId: resource.resourceId,
    resourceName: resource.resourceName,
    resourceCode: resource.resourceCode,
    building: resource.building || '',
    floor: resource.floor || '',
    roomOrAreaIdentifier: resource.roomOrAreaIdentifier || '',
    status: resource.status || 'ACTIVE',
    resourceType: resource.resourceType,
  }));
}

export async function checkScheduleOverlap({ resourceId, scheduleDate, startTime, endTime, ignoreScheduleId }) {
  if (!resourceId || !scheduleDate || !startTime || !endTime) return { hasConflict: false, conflictWith: null };
  const schedules = await listResourceStatusSchedules(resourceId);
  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const overlap = (Array.isArray(schedules) ? schedules : []).find((schedule) => {
    if (!schedule?.isActive) return false;
    if (ignoreScheduleId && Number(schedule.scheduleId) === Number(ignoreScheduleId)) return false;
    if (String(schedule.scheduleDate) !== String(scheduleDate)) return false;
    const existingStart = toMinutes(schedule.startTime);
    const existingEnd = toMinutes(schedule.endTime);
    return start < existingEnd && end > existingStart;
  });
  if (!overlap) return { hasConflict: false, conflictWith: null };
  return {
    hasConflict: true,
    conflictWith: {
      scheduleId: overlap.scheduleId,
      reasonNote: overlap.reasonNote || '',
      startTime: String(overlap.startTime || '').slice(0, 5),
      endTime: String(overlap.endTime || '').slice(0, 5),
    },
  };
}

export async function createGlobalSchedule(payload) {
  const { resourceId, scheduleDate, startTime, endTime, scheduledStatus, reasonNote, isActive = true } = payload;
  if (!resourceId) throw new Error('Resource is required');
  const { data } = await httpClient.post(`/api/resources/${resourceId}/status-schedules`, {
    scheduleDate,
    startTime: toBackendTime(startTime),
    endTime: toBackendTime(endTime),
    scheduledStatus,
    reasonNote: reasonNote ? String(reasonNote).trim() : '',
    isActive,
  });
  return data;
}

export async function updateGlobalSchedule(payload) {
  const { resourceId, scheduleId, scheduleDate, startTime, endTime, scheduledStatus, reasonNote, isActive = true } = payload;
  if (!resourceId || !scheduleId) throw new Error('Resource and schedule are required');
  const { data } = await httpClient.put(`/api/resources/${resourceId}/status-schedules/${scheduleId}`, {
    scheduleDate,
    startTime: toBackendTime(startTime),
    endTime: toBackendTime(endTime),
    scheduledStatus,
    reasonNote: reasonNote ? String(reasonNote).trim() : '',
    isActive,
  });
  return data;
}

export async function deleteGlobalSchedule({ resourceId, scheduleId }) {
  if (!resourceId || !scheduleId) throw new Error('Resource and schedule are required');
  await httpClient.delete(`/api/resources/${resourceId}/status-schedules/${scheduleId}`);
}

const STATUS_SCHEDULES_BATCH_BASE = '/api/status-schedules';

/**
 * Batch conflict check (read-only). Returns noConflictResourceIds and conflicts[].
 * @param {{ resourceIds: number[]; scheduleDate: string; startTime: string; endTime: string }} payload
 */
export async function precheckSchedules(payload) {
  const { data } = await httpClient.post(`${STATUS_SCHEDULES_BATCH_BASE}/precheck`, {
    resourceIds: payload.resourceIds,
    scheduleDate: payload.scheduleDate,
    startTime: toBackendTime(payload.startTime),
    endTime: toBackendTime(payload.endTime),
  });
  return data;
}

/**
 * Creates one schedule per resource for a shared window. Partial success: 200 OK with created/skipped.
 * @param {{ resourceIds: number[]; scheduleDate: string; startTime: string; endTime: string; scheduledStatus: string; reasonNote?: string; notifyAffectedUsers?: boolean }} payload
 */
export async function bulkCreateSchedules(payload) {
  const { data } = await httpClient.post(`${STATUS_SCHEDULES_BATCH_BASE}/bulk`, {
    resourceIds: payload.resourceIds,
    scheduleDate: payload.scheduleDate,
    startTime: toBackendTime(payload.startTime),
    endTime: toBackendTime(payload.endTime),
    scheduledStatus: payload.scheduledStatus,
    reasonNote: payload.reasonNote != null ? String(payload.reasonNote).trim() : '',
    notifyAffectedUsers: payload.notifyAffectedUsers ?? false,
  });
  return data;
}

/**
 * Emergency schedules (immediate or fixed window). notifyAffectedUsers / highPriority accepted; notifications are no-op until Module D.
 * @param {{ resourceIds: number[]; effectiveMode: 'IMMEDIATE' | 'SCHEDULED'; scheduledStatus: string; reasonNote: string; scheduleDate?: string; startTime?: string; endTime?: string; notifyAffectedUsers?: boolean; highPriority?: boolean }} payload
 */
export async function emergencyOverrideSchedules(payload) {
  const body = {
    resourceIds: payload.resourceIds,
    effectiveMode: payload.effectiveMode,
    scheduledStatus: payload.scheduledStatus,
    reasonNote: String(payload.reasonNote || '').trim(),
    notifyAffectedUsers: payload.notifyAffectedUsers ?? false,
    highPriority: payload.highPriority ?? false,
  };
  if (payload.effectiveMode === 'SCHEDULED') {
    body.scheduleDate = payload.scheduleDate;
    body.startTime = toBackendTime(payload.startTime);
    body.endTime = toBackendTime(payload.endTime);
  } else if (payload.endTime) {
    body.endTime = toBackendTime(payload.endTime);
  }
  const { data } = await httpClient.post(`${STATUS_SCHEDULES_BATCH_BASE}/emergency-override`, body);
  return data;
}
