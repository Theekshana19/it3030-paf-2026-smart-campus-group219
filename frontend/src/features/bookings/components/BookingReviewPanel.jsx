import { useState } from 'react';
import { toast } from 'sonner';
import * as bookingsApi from '../api/bookingsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';

// admin panel to approve or reject a pending booking
export default function BookingReviewPanel({ booking, onReviewed }) {
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  if (booking.bookingStatus !== 'PENDING') return null;

  const handleReview = async (approved) => {
    if (!approved && !remark.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setLoading(true);
    try {
      await bookingsApi.reviewBooking(booking.bookingId, {
        approved,
        adminRemark: remark.trim() || null,
        reviewerEmail: 'admin@smartcampus.lk',
      });
      toast.success(approved ? 'Booking approved' : 'Booking rejected');
      onReviewed();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary">
          <Icon name="admin_panel_settings" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Admin Review</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label">
            Remark (required for rejection)
          </label>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Add a remark or reason..."
            rows={3}
            className={inputClass}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleReview(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Icon name="check_circle" className="text-lg" />
            Approve
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => handleReview(false)}
            className="flex items-center gap-2 bg-error text-on-error px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name="cancel" className="text-lg" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
