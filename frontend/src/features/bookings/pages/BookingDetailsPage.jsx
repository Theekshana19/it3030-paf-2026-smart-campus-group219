import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as bookingsApi from '../api/bookingsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import BookingDetailCard from '../components/BookingDetailCard.jsx';
import BookingResourceCard from '../components/BookingResourceCard.jsx';
import BookingReviewPanel from '../components/BookingReviewPanel.jsx';
import BookingTimelineCard from '../components/BookingTimelineCard.jsx';
import Icon from '../../../components/common/Icon.jsx';

// page showing full details of a single booking
export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    setLoading(true);
    try {
      const data = await bookingsApi.getBookingById(bookingId);
      setBooking(data);
    } catch (e) {
      toast.error(getErrorMessage(e));
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  // cancel an approved booking
  const handleCancel = async () => {
    const confirmed = await confirmDeleteAlert({
      title: 'Cancel booking?',
      text: 'This approved booking will be cancelled.',
      confirmText: 'Yes, cancel it',
    });
    if (!confirmed) return;
    try {
      await bookingsApi.cancelBooking(bookingId, booking.userEmail);
      toast.success('Booking cancelled');
      loadBooking();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  if (loading) {
    return (
      <div className="p-8 md:p-10 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-container-high rounded w-64" />
          <div className="h-48 bg-surface-container-high rounded-xl" />
          <div className="h-48 bg-surface-container-high rounded-xl" />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="p-8 md:p-10 max-w-6xl mx-auto">
      {/* header with back button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            <Icon name="arrow_back" className="text-xl text-on-surface-variant" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-headline text-on-surface">
              {booking.bookingRef}
            </h1>
            <p className="text-sm text-on-surface-variant font-body">Booking Details</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booking.bookingStatus === 'PENDING' && (
            <button
              type="button"
              onClick={() => navigate(`/bookings/${bookingId}/edit`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm font-manrope text-primary hover:bg-surface-container-high transition-colors"
            >
              <Icon name="edit" className="text-lg" />
              Edit
            </button>
          )}
          {booking.bookingStatus === 'APPROVED' && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm font-manrope text-error hover:bg-error-container transition-colors"
            >
              <Icon name="event_busy" className="text-lg" />
              Cancel Booking
            </button>
          )}
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BookingDetailCard booking={booking} />
          <BookingTimelineCard
            resourceId={booking.resourceId}
            bookingDate={booking.bookingDate}
            currentBookingId={booking.bookingId}
          />
          <BookingReviewPanel booking={booking} onReviewed={loadBooking} />
        </div>
        <div>
          <BookingResourceCard booking={booking} />
        </div>
      </div>
    </div>
  );
}
