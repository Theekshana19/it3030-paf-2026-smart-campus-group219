import { useNavigate } from 'react-router-dom';
import TicketStatusBadge from './TicketStatusBadge.jsx';
import TicketPriorityBadge from './TicketPriorityBadge.jsx';
import Icon from '../../../components/common/Icon.jsx';

// this component displays all tickets in a table format
// each row is clickable and navigates to the ticket details page
export default function TicketTable({ items, sortBy, sortDir, toggleSort, onDelete }) {
  const navigate = useNavigate();

  const headers = [
    { key: 'ticketRef', label: 'Ref' },
    { key: 'title', label: 'Title' },
    { key: 'category', label: 'Category' },
    { key: 'priority', label: 'Priority' },
    { key: 'ticketStatus', label: 'Status' },
    { key: 'createdAt', label: 'Created' },
    { key: 'actions', label: '' },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-surface-container-high">
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={h.key !== 'actions' ? () => toggleSort(h.key) : undefined}
                  className={`px-4 py-3 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider font-label ${
                    h.key !== 'actions' ? 'cursor-pointer hover:text-on-surface' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {h.label}
                    {sortBy === h.key && (
                      <Icon name={sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'} className="text-sm text-primary" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((ticket) => (
              <tr
                key={ticket.ticketId}
                className="border-b border-surface-container-high hover:bg-surface-container-low transition-colors cursor-pointer"
                onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
              >
                <td className="px-4 py-3 font-medium text-primary">{ticket.ticketRef}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-on-surface truncate max-w-[200px]">{ticket.title}</div>
                  <div className="text-xs text-on-surface-variant">{ticket.locationDesc}</div>
                </td>
                <td className="px-4 py-3 text-on-surface text-xs">
                  {ticket.category?.replace('_', ' ')}
                </td>
                <td className="px-4 py-3">
                  <TicketPriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-4 py-3">
                  <TicketStatusBadge status={ticket.ticketStatus} />
                </td>
                <td className="px-4 py-3 text-on-surface-variant text-xs">
                  {ticket.createdAt?.replace('T', ' ').slice(0, 16)}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
                      className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                      title="View details"
                    >
                      <Icon name="visibility" className="text-lg text-on-surface-variant" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(ticket.ticketId, ticket.ticketRef)}
                      className="p-1.5 rounded-lg hover:bg-error-container transition-colors"
                      title="Delete ticket"
                    >
                      <Icon name="delete" className="text-lg text-error" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
