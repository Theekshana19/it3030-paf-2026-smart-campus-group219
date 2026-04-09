import Icon from '../../../components/common/Icon.jsx';

// shown when no bookings found in the list
export default function EmptyBookingsState() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
      <Icon name="event_busy" className="text-5xl text-on-surface-variant/40 mb-4" />
      <h3 className="text-lg font-bold font-manrope text-on-surface mb-1">No bookings found</h3>
      <p className="text-sm text-on-surface-variant font-body">
        Try changing your filters or create a new booking.
      </p>
    </div>
  );
}
