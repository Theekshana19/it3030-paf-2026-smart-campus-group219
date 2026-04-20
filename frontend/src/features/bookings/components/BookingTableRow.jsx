import { useNavigate } from 'react-router-dom';
import BookingStatusBadge from './BookingStatusBadge.jsx';
import Icon from '../../../components/common/Icon.jsx';

// single row in the booking table
export default function BookingTableRow({ booking, onDelete }) {
  const navigate = useNavigate();

  // format time like 09:00
  const formatTime = (t) => (t ? t.slice(0, 5) : '');

  return (
    <tr
      className="border-b border-surface-container-high hover:bg-surface-container-low transition-colors cursor-pointer"
      onClick={() => navigate(`/bookings/${booking.bookingId}`)}
    >
      <td className="px-4 py-3 font-medium text-primary">{booking.bookingRef}</td>
      <td className="px-4 py-3">
        <div className="font-medium text-on-surface">{booking.resourceName}</div>
        <div className="text-xs text-on-surface-variant">{booking.building}</div>
      </td>
      <td className="px-4 py-3 text-on-surface">{booking.bookingDate}</td>
      <td className="px-4 py-3 text-on-surface">
        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
      </td>
      <td className="px-4 py-3">
        <div className="text-on-surface">{booking.userName}</div>
        <div className="text-xs text-on-surface-variant">{booking.userEmail}</div>
      </td>
      <td className="px-4 py-3">
        <BookingStatusBadge status={booking.bookingStatus} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => navigate(`/bookings/${booking.bookingId}`)}
            className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
            title="View details"
          >
            <Icon name="visibility" className="text-lg text-on-surface-variant" />
          </button>
          {booking.bookingStatus === 'PENDING' && (
            <button
              type="button"
              onClick={() => navigate(`/bookings/${booking.bookingId}/edit`)}
              className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
              title="Edit booking"
            >
              <Icon name="edit" className="text-lg text-on-surface-variant" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(booking.bookingId, booking.bookingRef)}
            className="p-1.5 rounded-lg hover:bg-error-container transition-colors"
            title="Delete booking"
          >
            <Icon name="delete" className="text-lg text-error" />
          </button>
        </div>
      </td>
    </tr>
  );
}
