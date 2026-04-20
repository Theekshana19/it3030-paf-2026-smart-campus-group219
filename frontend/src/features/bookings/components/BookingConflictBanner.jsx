import Icon from '../../../components/common/Icon.jsx';

// shows a warning banner when a booking time conflicts with existing bookings
export default function BookingConflictBanner({ conflicts }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-yellow-800">
        <Icon name="warning" className="text-xl" />
        <h4 className="font-bold font-manrope text-sm">Booking Conflict Detected</h4>
      </div>

      {conflicts.map((c, idx) => (
        <div key={idx} className="text-sm text-yellow-700 font-body space-y-1">
          <p>
            <span className="font-medium">Conflict with {c.conflictBookingRef}:</span>{' '}
            {c.conflictStartTime?.slice(0, 5)} – {c.conflictEndTime?.slice(0, 5)}
            {c.conflictPurpose ? ` (${c.conflictPurpose})` : ''}
          </p>
        </div>
      ))}

      {/* show suggestions if available */}
      {conflicts[0]?.nextAvailableSlot && (
        <div className="text-sm text-yellow-700 font-body mt-2">
          <p className="font-medium flex items-center gap-1">
            <Icon name="lightbulb" className="text-base" />
            Suggestions:
          </p>
          <ul className="list-disc list-inside mt-1 space-y-0.5">
            <li>Next available slot: {conflicts[0].nextAvailableSlot}</li>
            {conflicts[0].alternativeResources?.map((alt, i) => (
              <li key={i}>Try: {alt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
