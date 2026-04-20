// this component shows the priority level with a colored indicator
// urgent issues are shown in red, low priority in green
const priorityStyles = {
  LOW: 'bg-green-50 text-green-700',
  MEDIUM: 'bg-yellow-50 text-yellow-700',
  HIGH: 'bg-orange-50 text-orange-700',
  URGENT: 'bg-red-50 text-red-700',
};

const priorityDots = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  URGENT: 'bg-red-500',
};

export default function TicketPriorityBadge({ priority }) {
  const style = priorityStyles[priority] || 'bg-gray-50 text-gray-600';
  const dotColor = priorityDots[priority] || 'bg-gray-400';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style}`}>
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {priority}
    </span>
  );
}
