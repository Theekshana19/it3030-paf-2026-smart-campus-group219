import BookingTableRow from './BookingTableRow.jsx';
import Icon from '../../../components/common/Icon.jsx';

const headers = [
  { key: 'bookingRef', label: 'Ref' },
  { key: 'resourceName', label: 'Resource' },
  { key: 'bookingDate', label: 'Date' },
  { key: 'startTime', label: 'Time' },
  { key: 'userName', label: 'User' },
  { key: 'bookingStatus', label: 'Status' },
  { key: 'actions', label: '' },
];

// table displaying all bookings with sortable columns
export default function BookingTable({ items, sortBy, sortDir, toggleSort, onDelete, onRefetch }) {
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
                      <Icon
                        name={sortDir === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        className="text-sm text-primary"
                      />
                    )}
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
