import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/common/Icon.jsx';

// page header with title and add booking button
export default function BookingListHeader({ totalItems }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">
          Booking Management
        </h1>
        <p className="text-on-surface-variant text-sm mt-1 font-body">
          {totalItems} booking{totalItems !== 1 ? 's' : ''} found
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate('/bookings/new')}
        className="flex items-center gap-2 bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity"
      >
        <Icon name="edit_calendar" className="text-lg" />
        New Booking
      </button>
    </div>
  );
}
