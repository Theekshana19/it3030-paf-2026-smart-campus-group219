// status badge with different colors for each booking status
const statusStyles = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-600',
};

export default function BookingStatusBadge({ status }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${style}`}>
      {status}
    </span>
  );
}
