import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { listResources } from '../../resources/api/resourcesApi.js';
import {
  createBooking,
  decideBooking,
  getMyBookings,
  getPendingBookings,
} from '../api/bookingsApi.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

function formatDt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export default function BookingsPage() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';
  const [mine, setMine] = useState([]);
  const [pending, setPending] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resourceId, setResourceId] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [myRes, pendingRes] = await Promise.all([
        getMyBookings(),
        isAdmin ? getPendingBookings() : Promise.resolve([]),
      ]);
      setMine(Array.isArray(myRes) ? myRes : []);
      setPending(Array.isArray(pendingRes) ? pendingRes : []);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      try {
        const list = await listResources({ page: 0, size: 100, status: 'ACTIVE' });
        const items = list?.items ?? list?.content ?? [];
        setResources(Array.isArray(items) ? items : []);
      } catch {
        setResources([]);
      }
    })();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!resourceId || !startAt || !endAt) {
      toast.error('Choose a resource and time range.');
      return;
    }
    const startIso = startAt.length === 16 ? `${startAt}:00` : startAt;
    const endIso = endAt.length === 16 ? `${endAt}:00` : endAt;
    setSubmitting(true);
    try {
      await createBooking({
        resourceId: Number(resourceId),
        startAt: startIso,
        endAt: endIso,
      });
      toast.success('Booking request submitted.');
      setStartAt('');
      setEndAt('');
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecide = async (bookingId, approved) => {
    setBusyId(bookingId);
    try {
      await decideBooking(bookingId, { approved, note: '' });
      toast.success(approved ? 'Booking approved.' : 'Booking rejected.');
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="sc-page">
      <div className="flex items-start gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="event" className="text-primary text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">
            Bookings
          </h2>
          <p className="text-on-surface-variant mt-1 font-body text-sm md:text-base leading-relaxed max-w-2xl">
            Request facility time slots. You will be notified when an administrator approves or rejects your request.
          </p>
        </div>
      </div>

      <section className="sc-panel p-6 mb-2">
        <h3 className="sc-section-title mb-4">New booking request</h3>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-on-surface mb-1">Resource</label>
            <select
              className="sc-input"
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              required
            >
              <option value="">Select an active resource</option>
              {resources.map((r) => (
                <option key={r.resourceId ?? r.id} value={r.resourceId ?? r.id}>
                  {r.resourceName ?? r.name} — {r.resourceCode ?? r.code}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Start</label>
            <input
              type="datetime-local"
              className="sc-input"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">End</label>
            <input
              type="datetime-local"
              className="sc-input"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="sc-btn-primary"
            >
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </div>
        </form>
      </section>

      <section className="sc-panel p-6 mb-2">
        <h3 className="sc-section-title mb-4">My bookings</h3>
        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading…</p>
        ) : mine.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200/80">
            {mine.map((b) => (
              <li key={b.bookingId} className="py-3.5 flex flex-wrap gap-2 justify-between items-start">
                <div>
                  <p className="font-medium text-on-surface">{b.resourceName}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {formatDt(b.startAt)} → {formatDt(b.endAt)}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    b.status === 'APPROVED'
                      ? 'bg-green-100 text-green-800'
                      : b.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isAdmin ? (
        <section className="sc-panel p-6">
          <h3 className="sc-section-title mb-4">Pending approvals (admin)</h3>
          {loading ? (
            <p className="text-sm text-on-surface-variant">Loading…</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No pending bookings.</p>
          ) : (
            <ul className="space-y-4">
              {pending.map((b) => (
                <li
                  key={b.bookingId}
                  className="flex flex-wrap gap-3 items-center justify-between border border-slate-200 rounded-xl p-4 bg-slate-50/60"
                >
                  <div>
                    <p className="font-medium text-on-surface">{b.resourceName}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {formatDt(b.startAt)} → {formatDt(b.endAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyId === b.bookingId}
                      className="sc-btn-success"
                      onClick={() => handleDecide(b.bookingId, true)}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === b.bookingId}
                      className="sc-btn-danger"
                      onClick={() => handleDecide(b.bookingId, false)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
    </div>
  );
}
