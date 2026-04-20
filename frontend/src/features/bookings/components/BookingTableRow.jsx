import { useNavigate } from 'react-router-dom';
import BookingStatusBadge from './BookingStatusBadge.jsx';
import Icon from '../../../components/common/Icon.jsx';

function UserAvatar({ name }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  return (
    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-xs font-bold text-primary font-manrope">{initials}</span>
    </div>
  );
}

export default function BookingTableRow({ booking, onDelete }) {
  const navigate = useNavigate();
  const formatTime = (t) => (t ? t.slice(0, 5) : '–');
  const formatDate = (d) => {
    if (!d) return '–';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  };

  return (
    <tr
      className="group border-b border-surface-container-high/60 hover:bg-primary/[0.03] transition-colors cursor-pointer"
      onClick={() => navigate(`/bookings/${booking.bookingId}`)}
    >
      {/* ref */}
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-md">
          {booking.bookingRef}
        </span>
      </td>

      {/* resource */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center flex-shrink-0">
            <Icon name="meeting_room" className="text-sm text-on-secondary-container" />
          </div>
          <div>
            <div className="text-sm font-semibold text-on-surface leading-tight">{booking.resourceName}</div>
            {booking.building && (
              <div className="text-xs text-on-surface-variant">{booking.building}</div>
            )}
          </div>
        </div>
      </td>

      {/* date */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <Icon name="calendar_today" className="text-sm text-on-surface-variant/60" />
          <span className="text-sm text-on-surface">{formatDate(booking.bookingDate)}</span>
        </div>
      </td>

      {/* time */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <Icon name="schedule" className="text-sm text-on-surface-variant/60" />
          <span className="text-sm text-on-surface font-mono">
            {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
          </span>
        </div>
      </td>

      {/* user */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <UserAvatar name={booking.userName} />
          <div>
            <div className="text-sm font-medium text-on-surface leading-tight">{booking.userName}</div>
            <div className="text-xs text-on-surface-variant">{booking.userEmail}</div>
          </div>
        </div>
      </td>

      {/* status */}
      <td className="px-4 py-3.5">
        <BookingStatusBadge status={booking.bookingStatus} />
      </td>

      {/* actions */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => navigate(`/bookings/${booking.bookingId}`)}
            className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
            title="View details"
          >
            <Icon name="open_in_new" className="text-base text-on-surface-variant" />
          </button>
          {booking.bookingStatus === 'PENDING' && (
            <button
              type="button"
              onClick={() => navigate(`/bookings/${booking.bookingId}/edit`)}
              className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
              title="Edit booking"
            >
              <Icon name="edit" className="text-base text-on-surface-variant" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(booking.bookingId, booking.bookingRef)}
            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            title="Delete booking"
          >
            <Icon name="delete_outline" className="text-base text-error" />
          </button>
        </div>
      </td>
    </tr>
  );
}
