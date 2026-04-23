import { useEffect, useState } from 'react';
import * as bookingsApi from '../api/bookingsApi.js';
import Icon from '../../../components/common/Icon.jsx';

// visual timeline showing bookings for this resource on the selected date
export default function BookingTimelineCard({ resourceId, bookingDate, currentBookingId }) {
  const [dayBookings, setDayBookings] = useState([]);

  useEffect(() => {
    if (!resourceId || !bookingDate) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await bookingsApi.listBookings({
          resourceId,
          dateFrom: bookingDate,
          dateTo: bookingDate,
          status: 'APPROVED',
          size: 50,
          sortBy: 'startTime',
          sortDir: 'asc',
        });
        if (!cancelled) setDayBookings(data.items || []);
      } catch {
        if (!cancelled) setDayBookings([]);
      }
    })();
    return () => { cancelled = true; };
  }, [resourceId, bookingDate]);

  if (dayBookings.length === 0) return null;

  // timeline from 8am to 8pm (12 hours)
  const startHour = 8;
  const endHour = 20;
  const totalMinutes = (endHour - startHour) * 60;
  const currentIsVisible = dayBookings.some((b) => b.bookingId === currentBookingId);

  const getPosition = (timeStr) => {
    const [h, m] = timeStr.slice(0, 5).split(':').map(Number);
    const mins = (h - startHour) * 60 + m;
    return Math.max(0, Math.min(100, (mins / totalMinutes) * 100));
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="timeline" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Day Timeline</h3>
      </div>

      {/* hour labels */}
      <div className="flex justify-between text-xs text-on-surface-variant font-label mb-1">
        {Array.from({ length: 7 }, (_, i) => startHour + i * 2).map((h) => (
          <span key={h}>{h}:00</span>
        ))}
      </div>

      {/* timeline bar */}
      <div className="relative h-8 bg-surface-container-low rounded-lg overflow-hidden">
        {dayBookings.map((b) => {
          const left = getPosition(b.startTime);
          const right = getPosition(b.endTime);
          const isCurrent = b.bookingId === currentBookingId;
          return (
            <div
              key={b.bookingId}
              className={`absolute top-1 bottom-1 rounded ${
                isCurrent ? 'bg-primary' : 'bg-primary/30'
              }`}
              style={{ left: `${left}%`, width: `${right - left}%` }}
              title={`${b.bookingRef}: ${b.startTime?.slice(0, 5)} - ${b.endTime?.slice(0, 5)}`}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-on-surface-variant font-body">
        {currentIsVisible && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-primary inline-block" /> Your booking
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-primary/30 inline-block" /> {currentIsVisible ? 'Other bookings' : 'Approved bookings'}
        </span>
      </div>
    </div>
  );
}
