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
    return [
      { start: '08:00', end: '11:00', type: 'AVAILABLE' },
      { start: '11:00', end: '14:00', type: 'BOOKED', label: 'Booked' },
      { start: '14:00', end: '15:00', type: 'BUFFER' },
      { start: '15:00', end: '20:00', type: 'BOOKED', label: 'Booked' },
    ];
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

/**
 * Isolated fallback until activity/audit endpoint is available.
 * @param {Record<string, any>|null} resource
 */
export function buildFallbackActivity(resource) {
  const name = resource?.resourceName || 'Resource';
  return [
    { key: 'schedule', title: 'Schedule Modified', sub: 'Added Friday maintenance window', who: 'Admin Sarah W.', when: '2 hours ago', icon: 'edit_note', tone: 'primary' },
    { key: 'booking', title: 'Booking Confirmed', sub: `${name} booking confirmed`, who: 'Prof. Aris T.', when: 'Yesterday, 4:15 PM', icon: 'check_circle', tone: 'tertiary' },
    { key: 'access', title: 'Access Logged', sub: 'Smart lock entry - Front door', who: 'James Miller (Staff)', when: 'Jan 24, 09:00 AM', icon: 'person', tone: 'neutral' },
  ];
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

