import Icon from '../../../components/common/Icon.jsx';

function dotClass(scheduledStatus) {
  switch (scheduledStatus) {
    case 'ACTIVE':
      return 'bg-tertiary';
    case 'OUT_OF_SERVICE':
      return 'bg-error';
    default:
      return 'bg-surface-container-highest';
  }
}

/**
 * @param {{
 *  schedules: {
 *    scheduleDate?: string;
 *    startTime?: string | null;
 *    endTime?: string | null;
 *    scheduledStatus?: string | null;
 *    reasonNote?: string | null;
 *    isActive?: boolean | null;
 *  }[];
 *  todayKey?: string;
 * }} props
 */
export default function ScheduleTimelineMini({ schedules, todayKey }) {
  const safe = Array.isArray(schedules) ? schedules : [];
  const today = todayKey ?? new Date().toISOString().slice(0, 10);

  const todayItems = safe
    .filter((s) => (s.scheduleDate ? String(s.scheduleDate) === today : true))
    .sort((a, b) => {
      const aStart = a.startTime ? String(a.startTime).slice(0, 5) : '00:00';
      const bStart = b.startTime ? String(b.startTime).slice(0, 5) : '00:00';
      return aStart.localeCompare(bStart);
    });

  if (todayItems.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-body">
        <span className="w-2 h-2 rounded-full bg-outline-variant/40" aria-hidden />
        No active schedules
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todayItems.slice(0, 4).map((s, idx) => {
        const dot = dotClass(s.scheduledStatus);
        const isLast = idx === Math.min(todayItems.length, 4) - 1;
        const start = s.startTime ? String(s.startTime).slice(0, 5) : '—';
        const end = s.endTime ? String(s.endTime).slice(0, 5) : '—';
        const statusLabel =
          s.scheduledStatus === 'ACTIVE'
            ? 'Active'
            : s.scheduledStatus === 'OUT_OF_SERVICE'
              ? 'Out of Service'
              : '—';

        return (
          <div key={`${s.scheduleDate ?? 'd'}-${start}-${idx}`} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {!isLast ? (
                <span className="w-0.5 flex-1 bg-surface-container border-dashed my-1" />
              ) : null}
            </div>
            <div className="pb-1">
              <p className="text-xs font-bold text-on-surface">{statusLabel}</p>
              <p className="text-[11px] text-secondary">
                {start} AM - {end} PM
              </p>
              {s.reasonNote ? (
                <p className="text-[10px] mt-1 italic text-on-surface-variant">
                  {s.reasonNote}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-2 pt-1 text-[10px] text-on-surface-variant font-body">
        <Icon name="schedule" className="text-sm text-outline-variant" />
        Showing upcoming schedules for today
      </div>
    </div>
  );
}

