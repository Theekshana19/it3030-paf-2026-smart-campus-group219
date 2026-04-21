import BookingTableRow from './BookingTableRow.jsx';
import Icon from '../../../components/common/Icon.jsx';

const headers = [
  { key: 'bookingRef',    label: 'Reference' },
  { key: 'resourceName',  label: 'Resource'  },
  { key: 'bookingDate',   label: 'Date'      },
  { key: 'startTime',     label: 'Time'      },
  { key: 'userName',      label: 'Booked By' },
  { key: 'bookingStatus', label: 'Status'    },
  { key: 'actions',       label: ''          },
];

export default function BookingTable({ items, sortBy, sortDir, toggleSort, onDelete, onRefetch }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <colgroup>
            <col className="w-[140px]" />
            <col className="w-[18%]" />
            <col className="w-[110px]" />
            <col className="w-[110px]" />
            <col />
            <col className="w-[120px]" />
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
            {items.map((booking) => (
              <BookingTableRow
                key={booking.bookingId}
                booking={booking}
                onDelete={onDelete}
                onRefetch={onRefetch}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
