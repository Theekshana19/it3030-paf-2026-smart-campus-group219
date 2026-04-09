import Icon from '../../../components/common/Icon.jsx';

// shows the resource info for a booking
export default function BookingResourceCard({ booking }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
          <Icon name="meeting_room" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Resource Details</h3>
      </div>

      <div className="space-y-3 text-sm font-body">
        <div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Resource</span>
          <p className="text-on-surface font-medium mt-0.5">{booking.resourceName}</p>
        </div>
        <div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Code</span>
          <p className="text-on-surface mt-0.5">{booking.resourceCode}</p>
        </div>
        <div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Type</span>
          <p className="text-on-surface mt-0.5">{booking.resourceType?.replace('_', ' ')}</p>
        </div>
        {booking.building && (
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Building</span>
            <p className="text-on-surface mt-0.5">{booking.building}</p>
          </div>
        )}
        {booking.capacity && (
          <div>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Capacity</span>
            <p className="text-on-surface mt-0.5">{booking.capacity} seats</p>
          </div>
        )}
      </div>
    </div>
  );
}
