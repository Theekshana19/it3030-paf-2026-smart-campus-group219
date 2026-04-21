import { useState } from 'react';
import { toast } from 'sonner';
import * as ticketsApi from '../api/ticketsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';
const labelClass = 'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

// this component shows the admin action panel on the ticket details page
// depending on the ticket status, different actions are available
export default function TicketAdminPanel({ ticket, onUpdated }) {
  const [technicianName, setTechnicianName] = useState('');
  const [technicianEmail, setTechnicianEmail] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  // assign a technician to work on this ticket
  const handleAssign = async () => {
    if (!technicianName.trim() || !technicianEmail.trim()) {
      toast.error('Please enter technician name and email');
      return;
    }
    setLoading(true);
    try {
      await ticketsApi.assignTicket(ticket.ticketId, {
        assignedToName: technicianName.trim(),
        assignedToEmail: technicianEmail.trim(),
      });
      toast.success('Technician assigned successfully');
      onUpdated();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // technician resolves the ticket with notes about what was done
  const handleResolve = async () => {
    if (!resolutionNotes.trim()) {
      toast.error('Please provide resolution notes');
      return;
    }
    setLoading(true);
    try {
      await ticketsApi.resolveTicket(ticket.ticketId, { resolutionNotes: resolutionNotes.trim() });
      toast.success('Ticket resolved');
      onUpdated();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // admin closes a resolved ticket
  const handleClose = async () => {
    setLoading(true);
    try {
      await ticketsApi.closeTicket(ticket.ticketId);
      toast.success('Ticket closed');
      onUpdated();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  // admin rejects a ticket with a reason
  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setLoading(true);
    try {
      await ticketsApi.rejectTicket(ticket.ticketId, { rejectReason: rejectReason.trim() });
      toast.success('Ticket rejected');
      onUpdated();
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
        <h3 className="text-lg font-bold font-manrope">Admin Actions</h3>
      </div>

      {/* show assign form when ticket is OPEN */}
      {ticket.ticketStatus === 'OPEN' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Technician Name</label>
              <input type="text" value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} className={inputClass} placeholder="Enter name" />
            </div>
            <div>
              <label className={labelClass}>Technician Email</label>
              <input type="email" value={technicianEmail} onChange={(e) => setTechnicianEmail(e.target.value)} className={inputClass} placeholder="Enter email" />
            </div>
          </div>
          <button type="button" disabled={loading} onClick={handleAssign}
            className="flex items-center gap-2 bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 disabled:opacity-50">
            <Icon name="person_add" className="text-lg" /> Assign Technician
          </button>

          <div className="border-t border-surface-container-high pt-4 space-y-3">
            <div>
              <label className={labelClass}>Reject Reason (required to reject)</label>
              <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} className={inputClass} rows={2} placeholder="Reason for rejection..." />
            </div>
            <button type="button" disabled={loading} onClick={handleReject}
              className="flex items-center gap-2 bg-error text-on-error px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 disabled:opacity-50">
              <Icon name="block" className="text-lg" /> Reject Ticket
            </button>
          </div>
        </div>
      )}

      {/* show resolve form when ticket is IN_PROGRESS */}
      {ticket.ticketStatus === 'IN_PROGRESS' && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Resolution Notes</label>
            <textarea value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)} className={inputClass} rows={3} placeholder="Describe what was done to fix the issue..." />
          </div>
          <button type="button" disabled={loading} onClick={handleResolve}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:bg-green-700 disabled:opacity-50">
            <Icon name="check_circle" className="text-lg" /> Mark as Resolved
          </button>
        </div>
      )}

      {/* show close button when ticket is RESOLVED */}
      {ticket.ticketStatus === 'RESOLVED' && (
        <button type="button" disabled={loading} onClick={handleClose}
          className="flex items-center gap-2 bg-primary-container text-on-primary px-5 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 disabled:opacity-50">
          <Icon name="lock" className="text-lg" /> Close Ticket
        </button>
      )}

      {/* show info when ticket is already closed or rejected */}
      {(ticket.ticketStatus === 'CLOSED' || ticket.ticketStatus === 'REJECTED') && (
        <p className="text-sm text-on-surface-variant font-body">
          This ticket is {ticket.ticketStatus.toLowerCase()}. No further actions available.
        </p>
      )}
    </div>
  );
}
