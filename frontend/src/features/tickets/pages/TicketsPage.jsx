import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { createTicket, getMyTickets } from '../api/ticketsApi.js';
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

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    setSubmitting(true);
    try {
      await createTicket({ title: title.trim(), description: description.trim() || undefined });
      toast.success('Ticket created.');
      setTitle('');
      setDescription('');
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sc-page">
      <div className="flex items-start gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
          <Icon name="confirmation_number" className="text-primary text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">
            Support tickets
          </h2>
          <p className="text-on-surface-variant mt-1 font-body text-sm md:text-base leading-relaxed max-w-2xl">
            Track issues and comments. You will be notified when ticket status changes or when someone comments on
            your ticket.
          </p>
        </div>
      </div>

      <section className="sc-panel p-6 mb-2">
        <h3 className="sc-section-title mb-4">Open a ticket</h3>
        <form className="space-y-4 max-w-xl" onSubmit={handleCreate}>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Title</label>
            <input
              className="sc-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Short summary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">Description (optional)</label>
            <textarea
              className="sc-input min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              placeholder="Details, steps to reproduce, etc."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="sc-btn-primary"
          >
            {submitting ? 'Creating…' : 'Create ticket'}
          </button>
        </form>
      </section>

      <section className="sc-panel p-6">
        <h3 className="sc-section-title mb-4">My tickets</h3>
        {loading ? (
          <p className="text-sm text-on-surface-variant">Loading…</p>
        ) : tickets.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No tickets yet.</p>
        ) : (
          <ul className="divide-y divide-slate-200/80">
            {tickets.map((t) => (
              <li key={t.ticketId} className="py-3 flex flex-wrap gap-2 justify-between items-center">
                <div>
                  <Link
                    to={`/tickets/${t.ticketId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {t.title}
                  </Link>
                  <p className="text-xs text-on-surface-variant mt-0.5">Updated {formatDt(t.updatedAt)}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-800">
                  {t.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
