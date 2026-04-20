import Icon from '../../../components/common/Icon.jsx';

export default function NotificationsBell({ unreadCount = 0, onClick }) {
  const safeCount = Number.isFinite(unreadCount) ? Math.max(0, unreadCount) : 0;
  const showBadge = safeCount > 0;
  const badgeLabel = safeCount > 99 ? '99+' : String(safeCount);

  return (
    <button
      type="button"
      className="p-2 rounded-full hover:bg-[#eaeef2] transition-colors relative"
      aria-label={`Notifications${showBadge ? `, ${badgeLabel} unread` : ''}`}
      onClick={onClick}
    >
      <Icon name="notifications" className="text-secondary" />
      {showBadge ? (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-error text-white text-[10px] leading-5 text-center font-semibold">
          {badgeLabel}
        </span>
      ) : null}
    </button>
  );
}
