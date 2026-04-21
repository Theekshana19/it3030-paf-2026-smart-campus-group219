import { useNavigate } from 'react-router-dom';
import TicketStatusBadge from './TicketStatusBadge.jsx';
import TicketPriorityBadge from './TicketPriorityBadge.jsx';
import Icon from '../../../components/common/Icon.jsx';

const headers = [
  { key: 'ticketRef',    label: 'Reference' },
  { key: 'title',        label: 'Title'     },
  { key: 'category',     label: 'Category'  },
  { key: 'priority',     label: 'Priority'  },
  { key: 'ticketStatus', label: 'Status'    },
  { key: 'createdAt',    label: 'Created'   },
  { key: 'actions',      label: ''          },
];

// this component displays all tickets in a table format
// each row is clickable and navigates to the ticket details page
export default function TicketTable({ items, sortBy, sortDir, toggleSort, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <colgroup>
            <col className="w-[140px]" />
            <col />
            <col className="w-[130px]" />
            <col className="w-[110px]" />
            <col className="w-[120px]" />
            <col className="w-[130px]" />
            <col className="w-[80px]" />
          </colgroup>
          <thead>
            <tr className="bg-surface-container-low/70 border-b border-surface-container-high">
              {headers.map((h) => (
                <th
                  key={h.key}
                  onClick={h.key !== 'actions' ? () => toggleSort(h.key) : undefined}
                  className={`px-4 py-3.5 text-left text-xs font-bold text-on-surface-variant uppercase tracking-wider font-label select-none ${
                    h.key !== 'actions' ? 'cursor-pointer hover:text-primary transition-colors' : ''
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {h.label}
                    {sortBy === h.key ? (
                      <Icon
                        name={sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        className="text-xs text-primary"
                      />
                    ) : h.key !== 'actions' ? (
                      <Icon name="unfold_more" className="text-xs text-on-surface-variant/30" />
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((ticket) => (
              <tr
                key={ticket.ticketId}
                className="group border-b border-surface-container-high/60 hover:bg-primary/[0.03] transition-colors cursor-pointer"
                onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
              >
                {/* reference */}
                <td className="px-4 py-3.5">
                  <span className="inline-flex items-center font-mono text-xs font-bold text-primary bg-primary/8 px-2 py-0.5 rounded-md">
                    {ticket.ticketRef}
                  </span>
                </td>

                {/* title + location */}
                <td className="px-4 py-3.5">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-on-surface truncate">{ticket.title}</div>
                    {ticket.locationDesc && (
                      <div className="text-xs text-on-surface-variant truncate flex items-center gap-1 mt-0.5">
                        <Icon name="location_on" className="text-xs flex-shrink-0" />
                        {ticket.locationDesc}
                      </div>
                    )}
                  </div>
                </td>

                {/* category */}
                <td className="px-4 py-3.5">
                  <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-lg">
                    {ticket.category?.replace(/_/g, ' ')}
                  </span>
                </td>

                {/* priority */}
                <td className="px-4 py-3.5">
                  <TicketPriorityBadge priority={ticket.priority} />
                </td>

                {/* status */}
                <td className="px-4 py-3.5">
                  <TicketStatusBadge status={ticket.ticketStatus} />
                </td>

                {/* created date */}
                <td className="px-4 py-3.5">
                  <span className="text-xs text-on-surface-variant font-body">
                    {ticket.createdAt ? ticket.createdAt.replace('T', ' ').slice(0, 16) : '–'}
                  </span>
                </td>

                {/* actions */}
                <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => navigate(`/tickets/${ticket.ticketId}`)}
                      className="p-1.5 rounded-lg hover:bg-surface-container-high transition-colors"
                      title="View details"
                    >
                      <Icon name="open_in_new" className="text-base text-on-surface-variant" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(ticket.ticketId, ticket.ticketRef)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete ticket"
                    >
                      <Icon name="delete_outline" className="text-base text-error" />
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
