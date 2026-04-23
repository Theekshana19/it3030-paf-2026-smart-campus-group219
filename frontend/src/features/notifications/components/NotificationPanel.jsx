import PropTypes from 'prop-types';
import Icon from '../../../components/common/Icon.jsx';

const TYPE_STYLE = {
  BOOKING: { icon: 'event_note', cls: 'bg-primary/10 text-primary' },
  TICKET: { icon: 'confirmation_number', cls: 'bg-tertiary/10 text-tertiary' },
  SYSTEM: { icon: 'info', cls: 'bg-secondary/10 text-secondary' },
  RESOURCE: { icon: 'inventory_2', cls: 'bg-secondary/10 text-secondary' },
  ROLE: { icon: 'manage_accounts', cls: 'bg-secondary/10 text-secondary' },
};

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NotificationItem({ item, onMarkRead }) {
  const style = TYPE_STYLE[item.type] ?? TYPE_STYLE.SYSTEM;
  return (
    <button
      type="button"
      onClick={() => !item.isRead && onMarkRead(item.notificationId)}
      className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-surface-container transition-colors ${
        !item.isRead ? 'border-l-2 border-primary bg-primary/5' : ''
      }`}
    >
      <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${style.cls}`}>
        <Icon name={style.icon} className="text-sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-semibold leading-snug ${item.isRead ? 'text-on-surface-variant' : 'text-on-surface'}`}>
            {item.title}
          </p>
          <span className="text-xs text-on-surface-variant whitespace-nowrap shrink-0">
            {relativeTime(item.createdAt)}
          </span>
        </div>
        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed line-clamp-2">
          {item.message}
        </p>
      </div>
    </button>
  );
}

NotificationItem.propTypes = {
  item: PropTypes.shape({
    notificationId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onMarkRead: PropTypes.func.isRequired,
};

export default function NotificationPanel({ notifications, loading, onMarkRead, onMarkAllRead }) {
  return (
    <div
      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-outline-variant/30 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
        <span className="font-semibold text-on-surface text-sm">Notifications</span>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs text-primary hover:underline font-medium"
        >
          Mark all as read
        </button>
      </div>

      {/* Body */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-outline-variant/10">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-on-surface-variant">
            <Icon name="notifications_none" className="text-3xl" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}

        {!loading && notifications.map((n) => (
          <NotificationItem key={n.notificationId} item={n} onMarkRead={onMarkRead} />
        ))}
      </div>
    </div>
  );
}

NotificationPanel.propTypes = {
  notifications: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onMarkRead: PropTypes.func.isRequired,
  onMarkAllRead: PropTypes.func.isRequired,
};
