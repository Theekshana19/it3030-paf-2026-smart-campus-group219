const WEEK_ORDER = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function toMinutes(t) {
  const [hh, mm] = String(t || '00:00').slice(0, 5).split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function toHHMM(mins) {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
}

/**
 * @param {string|undefined|null} workingDays
 * @param {string|undefined|null} from
 * @param {string|undefined|null} to
 */
export function buildOperatingHoursRows(workingDays, from, to) {
  const active = new Set(
    String(workingDays || '')
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean)
  );

  const hasWeekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI'].every((d) => active.has(d));
  const hasSaturday = active.has('SAT');
  const hasSunday = active.has('SUN');
  const fromTime = String(from || '08:00').slice(0, 5);
  const toTime = String(to || '20:00').slice(0, 5);

  return [
    { label: 'Mon-Fri', enabled: hasWeekdays, from: fromTime, to: toTime, spanClass: 'w-[60%] ml-[20%]' },
    { label: 'Saturday', enabled: hasSaturday, from: fromTime, to: toTime, spanClass: 'w-[40%] ml-[30%]' },
    { label: 'Sunday', enabled: hasSunday, from: fromTime, to: toTime, spanClass: 'w-[28%] ml-[36%]' },
  ];
}

/**
 * @param {Array<Record<string, any>>} schedules
 */
export function buildDetailsTimelineSegments(schedules) {
  const dayStart = 8 * 60;
  const dayEnd = 20 * 60;
  const items = Array.isArray(schedules) ? schedules : [];
  const sorted = items
    .filter((s) => s?.isActive !== false)
    .map((s) => ({
      start: Math.max(dayStart, toMinutes(s.startTime)),
      end: Math.min(dayEnd, toMinutes(s.endTime)),
      status: String(s.scheduledStatus || '').toUpperCase(),
      label: s.reasonNote || 'Scheduled',
    }))
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start);

  if (sorted.length === 0) {
    return [];
  }

  const out = [];
  let cursor = dayStart;
  for (const item of sorted) {
    if (cursor < item.start) {
      out.push({ start: toHHMM(cursor), end: toHHMM(item.start), type: 'AVAILABLE' });
    }
    out.push({
      start: toHHMM(item.start),
      end: toHHMM(item.end),
      type: item.status === 'OUT_OF_SERVICE' ? 'BUFFER' : 'BOOKED',
      label: item.label,
    });
    cursor = item.end;
  }
  if (cursor < dayEnd) {
    out.push({ start: toHHMM(cursor), end: toHHMM(dayEnd), type: 'AVAILABLE' });
  }
  return out;
}

function formatRelativeTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const diffMs = Date.now() - d.getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

/**
 * Builds recent activity from actual resource/schedule data only.
 * @param {Record<string, any>|null} resource
 * @param {Array<Record<string, any>>} schedules
 */
export function buildRealActivity(resource, schedules) {
  const feed = [];
  if (resource?.updatedAt) {
    feed.push({
      key: `resource-updated-${resource.resourceId ?? 'unknown'}`,
      title: 'Resource details updated',
      sub: `${resource.resourceCode || 'Resource'} · ${resource.status || 'UNKNOWN'}`,
      who: 'System',
      when: formatRelativeTime(resource.updatedAt),
      icon: 'edit_note',
      tone: 'primary',
      at: resource.updatedAt,
    });
  }

  const scheduleItems = (Array.isArray(schedules) ? schedules : [])
    .filter((s) => s?.updatedAt || s?.createdAt)
    .map((s) => ({
      key: `schedule-${s.scheduleId ?? Math.random()}`,
      title: 'Schedule window updated',
      sub: `${String(s.scheduleDate || '')} ${String(s.startTime || '').slice(0, 5)}-${String(
        s.endTime || ''
      ).slice(0, 5)}`,
      who: 'System',
      when: formatRelativeTime(s.updatedAt || s.createdAt),
      icon: 'schedule',
      tone: 'tertiary',
      at: s.updatedAt || s.createdAt,
    }));
  feed.push(...scheduleItems);

  return feed
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 5)
    .map(({ at, ...item }) => item);
}

export function todayIsoLocal() {
  const d = new Date();
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 10);
}

export function formatResourcePathLabel(resource) {
  const type = String(resource?.resourceType || '')
    .toLowerCase()
    .replaceAll('_', ' ');
  if (!type) return 'Resource';
  return type.replace(/\b\w/g, (c) => c.toUpperCase());
}

export { WEEK_ORDER };

