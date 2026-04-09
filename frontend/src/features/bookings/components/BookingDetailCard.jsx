import BookingStatusBadge from './BookingStatusBadge.jsx';
import Icon from '../../../components/common/Icon.jsx';

// shows all booking details in a card layout
export default function BookingDetailCard({ booking }) {
  const formatTime = (t) => (t ? t.slice(0, 5) : '');

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="event_note" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Booking Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body">
        <InfoRow label="Reference" value={booking.bookingRef} />
        <InfoRow label="Status">
          <BookingStatusBadge status={booking.bookingStatus} />
        </InfoRow>
        <InfoRow label="Date" value={booking.bookingDate} />
        <InfoRow label="Time" value={`${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`} />
        <InfoRow label="Purpose" value={booking.purpose} />
        <InfoRow label="Expected Attendees" value={booking.expectedCount ?? 'Not specified'} />
        <InfoRow label="Booked By" value={`${booking.userName} (${booking.userEmail})`} />
        <InfoRow label="Created" value={booking.createdAt?.replace('T', ' ').slice(0, 16)} />

        {booking.reviewedBy && (
          <>
            <InfoRow label="Reviewed By" value={booking.reviewedBy} />
            <InfoRow label="Reviewed At" value={booking.reviewedAt?.replace('T', ' ').slice(0, 16)} />
          </>
        )}

        {booking.adminRemark && (
          <div className="col-span-2">
            <InfoRow label="Admin Remark" value={booking.adminRemark} />
          </div>
        )}
      </div>
    </div>
  );
}

// helper row component for label-value pairs
function InfoRow({ label, value, children }) {
  return (
    <div>
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
      <div className="text-on-surface mt-0.5">{children || value}</div>
    </div>
  );
}
