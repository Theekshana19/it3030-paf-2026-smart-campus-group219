import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { addTicketComment, getTicket, updateTicketStatus } from '../api/ticketsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

function formatDt(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
}

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('OPEN');
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!ticketId) return;
    setLoading(true);
    try {
      const data = await getTicket(ticketId);
      setTicket(data);
      setStatus(data?.status ?? 'OPEN');
    } catch (e) {
      toast.error(getErrorMessage(e));
      navigate('/tickets', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [ticketId, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const saveStatus = async () => {
    if (!ticketId) return;
    setBusy(true);
    try {
      const updated = await updateTicketStatus(ticketId, { status });
      setTicket(updated);
      toast.success('Status updated.');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !ticketId) return;
    setBusy(true);
    try {
      await addTicketComment(ticketId, { body: comment.trim() });
      setComment('');
      await load();
      toast.success('Comment added.');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (loading || !ticket) {
    return (
      <div className="p-8 md:p-10 max-w-3xl mx-auto">
        <p className="text-sm text-on-surface-variant">Loading ticket…</p>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-3xl mx-auto">
      <button
        type="button"
        onClick={() => navigate('/tickets')}
        className="text-sm text-primary font-medium mb-6 hover:underline flex items-center gap-1"
      >
        <Icon name="arrow_back" className="text-base" /> Back to tickets
      </button>

      <div className="rounded-2xl border border-outline-variant/30 bg-white shadow-sm p-6 mb-6">
        <h2 className="text-2xl font-bold font-headline text-on-surface">{ticket.title}</h2>
        <p className="text-xs text-on-surface-variant mt-2">
          Created {formatDt(ticket.createdAt)} · Updated {formatDt(ticket.updatedAt)}
        </p>
        {ticket.description ? (
          <p className="mt-4 text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">Status</label>
            <select
              className="rounded-lg border border-outline-variant/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={busy || status === ticket.status}
            onClick={saveStatus}
            className="rounded-lg bg-[#3525cd] text-white text-sm font-semibold px-4 py-2 disabled:opacity-50"
          >
            Update status
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-outline-variant/30 bg-white shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-on-surface mb-4">Comments</h3>
        <ul className="space-y-4 mb-6">
          {(ticket.comments ?? []).length === 0 ? (
            <li className="text-sm text-on-surface-variant">No comments yet.</li>
          ) : (
            (ticket.comments ?? []).map((c) => (
              <li key={c.commentId} className="border-b border-outline-variant/15 pb-4 last:border-0">
                <p className="text-xs font-semibold text-on-surface">
                  {c.authorDisplayName ?? 'User'}{' '}
                  <span className="font-normal text-on-surface-variant">{formatDt(c.createdAt)}</span>
                </p>
                <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">{c.body}</p>
              </li>
            ))
          )}
        </ul>
        <form onSubmit={sendComment} className="space-y-2">
          <label className="block text-sm font-medium text-on-surface">Add comment</label>
          <textarea
            className="w-full rounded-lg border border-outline-variant/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 min-h-[88px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={2000}
            placeholder="Write a reply…"
          />
          <button
            type="submit"
            disabled={busy || !comment.trim()}
            className="rounded-lg bg-slate-800 text-white text-sm font-semibold px-4 py-2 disabled:opacity-50"
          >
            Post comment
          </button>
        </form>
      </section>
    </div>
  );
}
