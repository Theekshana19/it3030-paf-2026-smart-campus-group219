import Icon from '../../../components/common/Icon.jsx';

// this component shows the visual workflow steps for the ticket
// completed steps are highlighted, pending steps are grayed out
const workflowSteps = [
  { status: 'OPEN', label: 'Open', icon: 'flag' },
  { status: 'IN_PROGRESS', label: 'In Progress', icon: 'engineering' },
  { status: 'RESOLVED', label: 'Resolved', icon: 'check_circle' },
  { status: 'CLOSED', label: 'Closed', icon: 'lock' },
];

const statusOrder = { OPEN: 0, IN_PROGRESS: 1, RESOLVED: 2, CLOSED: 3, REJECTED: -1 };

export default function TicketWorkflowTimeline({ ticket }) {
  const currentIndex = statusOrder[ticket.ticketStatus] ?? -1;
  const isRejected = ticket.ticketStatus === 'REJECTED';

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="timeline" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Workflow</h3>
      </div>

      {isRejected ? (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
          <Icon name="block" className="text-2xl text-red-600" />
          <div>
            <p className="font-bold text-red-800 text-sm">Ticket Rejected</p>
            {ticket.rejectReason && (
              <p className="text-sm text-red-700 mt-1">Reason: {ticket.rejectReason}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {workflowSteps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={step.status} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  <Icon name={step.icon} className="text-base" />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCompleted ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {step.label}
                    {isCurrent && <span className="ml-2 text-xs text-primary font-bold">(Current)</span>}
                  </p>
                  {/* show timestamps for completed steps */}
                  {step.status === 'OPEN' && ticket.createdAt && (
                    <p className="text-xs text-on-surface-variant">{ticket.createdAt?.replace('T', ' ').slice(0, 16)}</p>
                  )}
                  {step.status === 'IN_PROGRESS' && ticket.assignedAt && (
                    <p className="text-xs text-on-surface-variant">
                      Assigned to {ticket.assignedToName} — {ticket.assignedAt?.replace('T', ' ').slice(0, 16)}
                    </p>
                  )}
                  {step.status === 'RESOLVED' && ticket.resolvedAt && (
                    <p className="text-xs text-on-surface-variant">{ticket.resolvedAt?.replace('T', ' ').slice(0, 16)}</p>
                  )}
                  {step.status === 'CLOSED' && ticket.closedAt && (
                    <p className="text-xs text-on-surface-variant">{ticket.closedAt?.replace('T', ' ').slice(0, 16)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
