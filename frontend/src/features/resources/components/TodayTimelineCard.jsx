import TimelineLegend from './TimelineLegend.jsx';

function minutesOf(time) {
  if (!time) return 0;
  const [hh, mm] = String(time).slice(0, 5).split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

/**
 * @param {{
 *   segments: { start: string; end: string; status: string; label?: string }[];
 *   dayStart?: string;
 *   dayEnd?: string;
 *   bookingSegment?: { start: string; end: string } | null;
 * }} props
 */
export default function TodayTimelineCard({
  segments,
  dayStart = '08:00',
  dayEnd = '20:00',
  bookingSegment = null,
}) {
  const startMin = minutesOf(dayStart);
  const endMin = minutesOf(dayEnd);
  const total = Math.max(endMin - startMin, 1);

  const now = new Date();
  const currentPercent = ((now.getHours() * 60 + now.getMinutes() - startMin) / total) * 100;
  const clampedCurrent = Math.min(100, Math.max(0, currentPercent));
  const bookingStart = bookingSegment ? Math.max(startMin, minutesOf(bookingSegment.start)) : null;
  const bookingEnd = bookingSegment ? Math.min(endMin, minutesOf(bookingSegment.end)) : null;
  const bookingLeft =
    bookingStart != null ? Math.min(100, Math.max(0, ((bookingStart - startMin) / total) * 100)) : 0;
  const bookingWidth =
    bookingStart != null && bookingEnd != null
      ? Math.min(100, Math.max(0, ((bookingEnd - bookingStart) / total) * 100))
      : 0;

  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline font-bold text-lg">Today&apos;s Timeline</h3>
        <TimelineLegend
          items={[
            { label: 'Active', colorClass: 'bg-primary/20' },
            { label: 'Maintenance', colorClass: 'bg-secondary' },
            { label: 'Booking', colorClass: 'bg-primary-container' },
          ]}
        />
      </div>

      <div className="relative pt-6 pb-2">
        <div className="flex justify-between text-[10px] font-bold text-on-surface-variant opacity-60 mb-2">
          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="h-12 w-full bg-primary/10 rounded-lg flex relative overflow-hidden">
          {segments.map((segment, index) => {
            const segmentStart = Math.max(minutesOf(segment.start), startMin);
            const segmentEnd = Math.min(minutesOf(segment.end), endMin);
            const width = ((segmentEnd - segmentStart) / total) * 100;
            if (width <= 0) return null;
            const isOut = String(segment.status).toUpperCase() === 'OUT_OF_SERVICE';
            return (
              <div
                key={`${segment.start}-${segment.end}-${index}`}
                className={[
                  'h-full border-r border-white/20 flex items-center justify-center',
                  isOut ? 'bg-secondary' : 'bg-primary/30',
                ].join(' ')}
                style={{ width: `${width}%` }}
                title={`${segment.start} - ${segment.end}`}
              >
                {isOut && width > 10 ? (
                  <span className="text-[10px] text-white font-bold uppercase tracking-tighter">
                    {segment.label || 'Maint.'}
                  </span>
                ) : null}
              </div>
            );
          })}

          {bookingWidth > 0 ? (
            <div
              className="absolute top-0 bottom-0 bg-primary-container/80 border-x border-white/30 z-[8]"
              style={{ left: `${bookingLeft}%`, width: `${bookingWidth}%` }}
              title={`Selected booking: ${bookingSegment.start} - ${bookingSegment.end}`}
            />
          ) : null}

          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-[0_0_10px_rgba(53,37,205,0.5)] z-10"
            style={{ left: `${clampedCurrent}%` }}
          >
            <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

