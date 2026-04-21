import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/common/Icon.jsx';

export default function EmptyBookingsState() {
  const navigate = useNavigate();
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm p-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5">
        <Icon name="event_busy" className="text-3xl text-primary/40" />
      </div>
      <h3 className="text-lg font-bold font-manrope text-on-surface mb-2">No bookings found</h3>
      <p className="text-sm text-on-surface-variant font-body max-w-xs mx-auto mb-6">
        Try adjusting your filters or create the first booking for a facility.
      </p>
      <button
        type="button"
        onClick={() => navigate('/bookings/new')}
        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold font-manrope hover:bg-primary/90 transition-colors"
      >
        <Icon name="add" className="text-lg" />
        New Booking
      </button>
    </div>
  );
}
