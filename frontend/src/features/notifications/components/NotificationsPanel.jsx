import Icon from '../../../components/common/Icon.jsx';

export default function NotificationsPanel({
  notifications = [],
  loading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  busyId = null,
  busyDeleteId = null,
  markAllBusy = false,
}) {
  if (loading) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-white shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-on-surface">Notifications</h3>
          <span className="text-xs text-on-surface-variant">Loading...</span>
        </div>
        <div className="space-y-2">
          <div className="h-14 rounded-lg bg-surface-container animate-pulse" />
          <div className="h-14 rounded-lg bg-surface-container animate-pulse" />
          <div className="h-14 rounded-lg bg-surface-container animate-pulse" />
        </div>
      </div>
    );
  }

  if (!notifications.length) {
    return (
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-white shadow-sm p-6 text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
          <Icon name="notifications" className="text-on-surface-variant" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-on-surface">No notifications</h3>
        <p className="mt-1 text-xs text-on-surface-variant">
          You are all caught up. New activity will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/20">
        <h3 className="text-sm font-semibold text-on-surface">Notifications</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant">{notifications.length}</span>
          <button
            type="button"
            className="text-xs font-medium text-primary disabled:opacity-50"
            onClick={onMarkAllAsRead}
            disabled={markAllBusy}
          >
            Mark all read
          </button>
        </div>
      </div>

      <ul className="max-h-96 overflow-auto divide-y divide-outline-variant/20">
        {notifications.map((item) => {
          const nid = item.notificationId ?? item.id;
          return (
            <li key={item.id ?? item.notificationId ?? `${item.title}-${item.createdAt}`} className="px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-on-surface">{item.title ?? 'Notification'}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {item.message ?? 'You have a new update.'}
                  </p>
                  {item.type ? (
                    <p className="text-[10px] uppercase tracking-wide text-on-surface-variant/80 mt-1">
                      {item.type}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary whitespace-nowrap disabled:opacity-50"
                    onClick={() => onMarkAsRead?.(nid)}
                    disabled={busyId === nid || Boolean(item.isRead)}
                  >
                    {item.isRead ? 'Read' : busyId === nid ? 'Saving...' : 'Mark read'}
                  </button>
                  {onDelete ? (
                    <button
                      type="button"
                      className="text-xs font-medium text-error/90 whitespace-nowrap disabled:opacity-50 inline-flex items-center gap-0.5"
                      onClick={() => onDelete(nid)}
                      disabled={busyDeleteId === nid}
                      title="Remove notification"
                    >
                      <Icon name="delete" className="text-[14px]" />
                      {busyDeleteId === nid ? '…' : 'Remove'}
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
