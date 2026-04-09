import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as ticketsApi from '../api/ticketsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import TicketStatusBadge from '../components/TicketStatusBadge.jsx';
import TicketPriorityBadge from '../components/TicketPriorityBadge.jsx';
import TicketPatternAlert from '../components/TicketPatternAlert.jsx';
import TicketWorkflowTimeline from '../components/TicketWorkflowTimeline.jsx';
import TicketAdminPanel from '../components/TicketAdminPanel.jsx';
import TicketImageUploader from '../components/TicketImageUploader.jsx';
import TicketCommentsCard from '../components/TicketCommentsCard.jsx';
import Icon from '../../../components/common/Icon.jsx';

// this page shows the full details of a single incident ticket
// it includes the ticket info, workflow timeline, attachments, comments,
// pattern detection alert, and admin action panel
export default function TicketDetailsPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTicket = async () => {
    setLoading(true);
    try {
      const data = await ticketsApi.getTicketById(ticketId);
      setTicket(data);
    } catch (e) {
      toast.error(getErrorMessage(e));
      navigate('/tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="p-8 md:p-10 max-w-6xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-surface-container-high rounded w-64" />
        <div className="h-48 bg-surface-container-high rounded-xl" />
        <div className="h-48 bg-surface-container-high rounded-xl" />
      </div>
    );
  }

  if (!ticket) return null;

  return (
    <div className="p-8 md:p-10 max-w-6xl mx-auto">
      {/* header with back button and ticket reference */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate('/tickets')}
            className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
            <Icon name="arrow_back" className="text-xl text-on-surface-variant" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-headline text-on-surface">{ticket.ticketRef}</h1>
              <TicketStatusBadge status={ticket.ticketStatus} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
            <p className="text-sm text-on-surface-variant font-body mt-0.5">{ticket.title}</p>
          </div>
        </div>
        {ticket.ticketStatus === 'OPEN' && (
          <button type="button" onClick={() => navigate(`/tickets/${ticketId}/edit`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm font-manrope text-primary hover:bg-surface-container-high transition-colors">
            <Icon name="edit" className="text-lg" /> Edit
          </button>
        )}
      </div>

      {/* pattern detection alert banner */}
      <TicketPatternAlert ticketId={ticket.ticketId} />

      {/* main content in two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {/* ticket details card */}
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
                <Icon name="confirmation_number" className="text-xl" />
              </span>
              <h3 className="text-lg font-bold font-manrope">Ticket Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body">
              <InfoRow label="Category" value={ticket.category?.replace('_', ' ')} />
              <InfoRow label="Location" value={ticket.locationDesc} />
              {ticket.resourceName && <InfoRow label="Resource" value={`${ticket.resourceName} (${ticket.resourceCode})`} />}
              <InfoRow label="Reporter" value={`${ticket.reporterName} (${ticket.reporterEmail})`} />
              {ticket.contactPhone && <InfoRow label="Phone" value={ticket.contactPhone} />}
              {ticket.contactMethod && <InfoRow label="Preferred Contact" value={ticket.contactMethod} />}
              <InfoRow label="Created" value={ticket.createdAt?.replace('T', ' ').slice(0, 16)} />
              {ticket.assignedToName && <InfoRow label="Assigned To" value={`${ticket.assignedToName} (${ticket.assignedToEmail})`} />}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-container-high">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</span>
              <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">{ticket.description}</p>
            </div>
            {ticket.resolutionNotes && (
              <div className="mt-4 pt-4 border-t border-surface-container-high">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Resolution Notes</span>
                <p className="text-sm text-on-surface mt-1 whitespace-pre-wrap">{ticket.resolutionNotes}</p>
              </div>
            )}
          </div>

          {/* image attachments section */}
          <TicketImageUploader
            ticketId={ticket.ticketId}
            attachments={ticket.attachments || []}
            onUploaded={loadTicket}
          />

          {/* comments section */}
          <TicketCommentsCard ticketId={ticket.ticketId} />
        </div>

        {/* right sidebar with workflow and admin panel */}
        <div className="space-y-6">
          <TicketWorkflowTimeline ticket={ticket} />
          <TicketAdminPanel ticket={ticket} onUpdated={loadTicket} />
        </div>
      </div>
    </div>
  );
}

// helper component for displaying label-value pairs
function InfoRow({ label, value }) {
  return (
    <div>
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
      <p className="text-on-surface mt-0.5">{value}</p>
    </div>
  );
}
