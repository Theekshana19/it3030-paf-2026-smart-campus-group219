import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { bookingSchema } from '../validation/bookingSchema.js';
import * as bookingsApi from '../api/bookingsApi.js';
import * as resourcesApi from '../../resources/api/resourcesApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { successAlert } from '../../../utils/sweetAlerts.js';
import BookingConflictBanner from '../components/BookingConflictBanner.jsx';
import Icon from '../../../components/common/Icon.jsx';

const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';
const labelClass = 'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

// page to edit a pending booking
export default function EditBookingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register, handleSubmit, watch, setValue, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: 'onTouched',
  });

  const watched = watch();

  // load existing booking data and resources
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [booking, resourceData] = await Promise.all([
          bookingsApi.getBookingById(bookingId),
          resourcesApi.listResources({ size: 100, sortBy: 'resourceName', sortDir: 'asc' }),
        ]);

        if (cancelled) return;

        // only pending bookings can be edited
        if (booking.bookingStatus !== 'PENDING') {
          toast.error('Only pending bookings can be edited');
          navigate(`/bookings/${bookingId}`);
          return;
        }

        setResources(resourceData.items || []);
        reset({
          resourceId: booking.resourceId,
          bookingDate: booking.bookingDate,
          startTime: booking.startTime?.slice(0, 5),
          endTime: booking.endTime?.slice(0, 5),
          purpose: booking.purpose,
          expectedCount: booking.expectedCount ?? '',
          userEmail: booking.userEmail,
          userName: booking.userName,
        });
      } catch (e) {
        if (!cancelled) {
          toast.error(getErrorMessage(e));
          navigate('/bookings');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [bookingId]);

  // check conflicts when resource, date, or time changes
  useEffect(() => {
    const { resourceId, bookingDate, startTime, endTime } = watched;
    if (!resourceId || !bookingDate || !startTime || !endTime || startTime >= endTime) {
      setConflicts([]);
      return;
    }
    let cancelled = false;
    const timeout = setTimeout(async () => {
      try {
        const data = await bookingsApi.checkConflicts(resourceId, bookingDate, startTime, endTime);
        if (!cancelled) setConflicts(data);
      } catch {
        if (!cancelled) setConflicts([]);
      }
    }, 500);
    return () => { cancelled = true; clearTimeout(timeout); };
  }, [watched.resourceId, watched.bookingDate, watched.startTime, watched.endTime]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        resourceId: data.resourceId,
        userEmail: data.userEmail.trim(),
        userName: data.userName.trim(),
        bookingDate: data.bookingDate,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose.trim(),
        expectedCount: data.expectedCount ? Number(data.expectedCount) : null,
      };
      await bookingsApi.updateBooking(bookingId, payload);
      await successAlert({ title: 'Booking updated successfully' });
      navigate(`/bookings/${bookingId}`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  if (loading) {
    return (
      <div className="p-8 md:p-10 max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-surface-container-high rounded w-64" />
        <div className="h-48 bg-surface-container-high rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(`/bookings/${bookingId}`)}
          className="p-2 rounded-lg hover:bg-surface-container-high transition-colors"
        >
          <Icon name="arrow_back" className="text-xl text-on-surface-variant" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Edit Booking</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-body">Update your pending booking request.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* resource selection */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="meeting_room" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Resource</h3>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Resource</label>
            <select
              value={watched.resourceId || ''}
              onChange={(e) => setValue('resourceId', Number(e.target.value) || undefined, { shouldValidate: true })}
              className={inputClass}
            >
              <option value="">Choose a resource...</option>
              {resources.map((r) => (
                <option key={r.resourceId} value={r.resourceId}>
                  {r.resourceName} ({r.resourceType?.replace('_', ' ')}, {r.building})
                </option>
              ))}
            </select>
            {errors.resourceId?.message && (
              <p className="text-error text-xs font-medium">{errors.resourceId.message}</p>
            )}
          </div>
        </div>

        {/* date and time */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="schedule" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Date & Time</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Date</label>
              <input type="date" {...register('bookingDate')} className={inputClass} />
              {errors.bookingDate?.message && <p className="text-error text-xs font-medium">{errors.bookingDate.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Start Time</label>
              <input type="time" {...register('startTime')} className={inputClass} />
              {errors.startTime?.message && <p className="text-error text-xs font-medium">{errors.startTime.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>End Time</label>
              <input type="time" {...register('endTime')} className={inputClass} />
              {errors.endTime?.message && <p className="text-error text-xs font-medium">{errors.endTime.message}</p>}
            </div>
          </div>
          {conflicts.length > 0 && (
            <div className="mt-4"><BookingConflictBanner conflicts={conflicts} /></div>
          )}
        </div>

        {/* booking details */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="description" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Name</label>
              <input type="text" {...register('userName')} className={inputClass} />
              {errors.userName?.message && <p className="text-error text-xs font-medium">{errors.userName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Email</label>
              <input type="email" {...register('userEmail')} className={inputClass} />
              {errors.userEmail?.message && <p className="text-error text-xs font-medium">{errors.userEmail.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className={labelClass}>Purpose</label>
              <textarea {...register('purpose')} rows={3} className={inputClass} />
              {errors.purpose?.message && <p className="text-error text-xs font-medium">{errors.purpose.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Expected Attendees</label>
              <input type="number" {...register('expectedCount')} className={inputClass} min="0" />
              {errors.expectedCount?.message && <p className="text-error text-xs font-medium">{errors.expectedCount.message}</p>}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(`/bookings/${bookingId}`)}
            className="px-6 py-2.5 rounded-lg font-bold text-sm font-manrope text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name="save" className="text-lg" />
            {isSubmitting ? 'Saving...' : 'Update Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
