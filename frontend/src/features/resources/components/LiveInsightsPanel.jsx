import ScheduleTimelineMini from './ScheduleTimelineMini.jsx';
import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *  todayBookingCount?: number | null;
 *  schedules?: {
 *    scheduleDate?: string;
 *    startTime?: string | null;
 *    endTime?: string | null;
 *    scheduledStatus?: string | null;
 *    reasonNote?: string | null;
 *    isActive?: boolean | null;
 *  }[];
 * }} props
 */
export default function LiveInsightsPanel({ todayBookingCount, schedules = [] }) {
  const confirmed = todayBookingCount ?? 0;
  const hasBookingMetric = todayBookingCount != null;
  const occupancyPct = hasBookingMetric ? Math.min(100, Math.max(0, confirmed * 12)) : 0;

  return (
    <aside className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-surface-container-highest/30">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse" aria-hidden />
          <h3 className="text-sm font-bold font-manrope uppercase tracking-widest text-on-surface-variant">
            Live Insights
          </h3>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-4">Today's Activity</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold font-manrope text-primary">{confirmed}</span>
              <span className="text-sm text-secondary mb-1">Bookings Confirmed</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: `${occupancyPct}%` }} />
            </div>
            <p className="text-[10px] text-secondary mt-2">
              {hasBookingMetric
                ? `${occupancyPct}% based on today's confirmed bookings`
                : 'Occupancy insight unavailable (booking metrics not integrated).'}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-on-surface-variant uppercase mb-4">Active Schedule</p>
            <ScheduleTimelineMini schedules={schedules} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface p-3 rounded-lg border border-surface-container-highest">
              <p className="text-[10px] uppercase font-bold text-secondary mb-1">Energy</p>
              <p className="text-sm font-bold text-on-surface-variant">No data</p>
            </div>
            <div className="bg-surface p-3 rounded-lg border border-surface-container-highest">
              <p className="text-[10px] uppercase font-bold text-secondary mb-1">Uptime</p>
              <p className="text-sm font-bold text-on-surface-variant">No data</p>
            </div>
          </div>
        </div>
      </div>

      {/* Small visual separator matching Stitch rhythm */}
      <div className="hidden md:block">
        <Icon name="tips_and_updates" className="text-outline-variant/30" />
      </div>
    </aside>
  );
}

