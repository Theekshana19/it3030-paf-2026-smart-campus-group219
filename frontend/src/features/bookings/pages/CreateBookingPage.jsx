import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
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

const defaultValues = {
  resourceId: undefined,
  bookingDate: '',
  startTime: '09:00',
  endTime: '11:00',
  purpose: '',
  expectedCount: '',
  userEmail: '',
  userName: '',
};

// page to create a new booking
export default function CreateBookingPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [selectedResource, setSelectedResource] = useState(null);

  const {
    register, handleSubmit, watch, setValue, formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const watched = watch();

  // load resources for the dropdown
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await resourcesApi.listResources({ size: 100, sortBy: 'resourceName', sortDir: 'asc' });
        if (!cancelled) setResources(data.items || []);
      } catch {
        if (!cancelled) setResources([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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

  // update selected resource info when dropdown changes
  const handleResourceChange = useCallback(
    (e) => {
      const id = Number(e.target.value);
      setValue('resourceId', id || undefined, { shouldValidate: true });
      setSelectedResource(resources.find((r) => r.resourceId === id) || null);
    },
    [resources, setValue]
  );

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
      await bookingsApi.createBooking(payload);
      await successAlert({ title: 'Booking submitted successfully' });
      navigate('/bookings');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  return (
    <div className="p-8 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">New Booking Request</h1>
        <p className="text-on-surface-variant text-sm mt-1 font-body">Fill in the details to request a resource booking.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* resource selection section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="meeting_room" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Select Resource</h3>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>Resource</label>
            <select
              onChange={handleResourceChange}
              value={watched.resourceId || ''}
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

          {/* show selected resource details */}
          {selectedResource && (
            <div className="mt-4 p-4 bg-surface-container-low rounded-lg text-sm font-body">
              <p className="font-medium text-on-surface">{selectedResource.resourceName}</p>
              <p className="text-on-surface-variant">
                Capacity: {selectedResource.capacity ?? 'N/A'} | Building: {selectedResource.building} | Status: {selectedResource.status}
              </p>
            </div>
          )}
        </div>

        {/* date and time section */}
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
              {errors.bookingDate?.message && (
                <p className="text-error text-xs font-medium">{errors.bookingDate.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Start Time</label>
              <input type="time" {...register('startTime')} className={inputClass} />
              {errors.startTime?.message && (
                <p className="text-error text-xs font-medium">{errors.startTime.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>End Time</label>
              <input type="time" {...register('endTime')} className={inputClass} />
              {errors.endTime?.message && (
                <p className="text-error text-xs font-medium">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          {/* conflict warning */}
          {conflicts.length > 0 && (
            <div className="mt-4">
              <BookingConflictBanner conflicts={conflicts} />
            </div>
          )}
        </div>

        {/* booking details section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="description" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Booking Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Your Name</label>
              <input type="text" {...register('userName')} className={inputClass} placeholder="Enter your name" />
              {errors.userName?.message && (
                <p className="text-error text-xs font-medium">{errors.userName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Your Email</label>
              <input type="email" {...register('userEmail')} className={inputClass} placeholder="your.email@example.com" />
              {errors.userEmail?.message && (
                <p className="text-error text-xs font-medium">{errors.userEmail.message}</p>
              )}
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className={labelClass}>Purpose</label>
              <textarea {...register('purpose')} rows={3} className={inputClass} placeholder="Describe the purpose of your booking..." />
              {errors.purpose?.message && (
                <p className="text-error text-xs font-medium">{errors.purpose.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Expected Attendees</label>
              <input type="number" {...register('expectedCount')} className={inputClass} placeholder="Optional" min="0" />
              {errors.expectedCount?.message && (
                <p className="text-error text-xs font-medium">{errors.expectedCount.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/bookings')}
            className="px-6 py-2.5 rounded-lg font-bold text-sm font-manrope text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name="send" className="text-lg" />
            {isSubmitting ? 'Submitting...' : 'Submit Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
