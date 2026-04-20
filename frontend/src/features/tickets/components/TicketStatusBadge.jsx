// this component displays the ticket status as a colored badge
// each status has a different color to make it easy to identify
const statusStyles = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-orange-100 text-orange-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-600',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function TicketStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600';
  const displayLabel = status === 'IN_PROGRESS' ? 'In Progress' : status;
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${style}`}>
      {displayLabel}
    </span>
  );
}
