import { useCallback, useEffect, useMemo, useState } from 'react';
import NotificationsPanel from '../components/NotificationsPanel.jsx';
import { useAuth } from '../../auth/hooks/useAuth.js';
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../api/notificationsApi.js';

export default function NotificationsPage() {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [busyDeleteId, setBusyDeleteId] = useState(null);
  const [markAllBusy, setMarkAllBusy] = useState(false);

  const hasSession = Boolean(currentUser?.googleToken ?? localStorage.getItem('googleToken'));

  const loadNotifications = useCallback(async () => {
    if (!hasSession) {
      setNotifications([]);
      setError('Please sign in to view notifications.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load notifications.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [hasSession]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = useCallback(async (notificationId) => {
    if (notificationId == null) return;
    setBusyId(notificationId);
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          (n.notificationId ?? n.id) === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
    } finally {
      setBusyId(null);
    }
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    setMarkAllBusy(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? new Date() })));
    } finally {
      setMarkAllBusy(false);
    }
  }, []);

  const handleDelete = useCallback(async (notificationId) => {
    if (notificationId == null) return;
    setBusyDeleteId(notificationId);
    try {
      await deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => (n.notificationId ?? n.id) !== notificationId));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete notification.');
    } finally {
      setBusyDeleteId(null);
    }
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !Boolean(n.isRead)).length,
    [notifications]
  );

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">
          Notifications
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant font-body">
          View your latest booking, ticket, and system updates.
        </p>
      </div>

      <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-on-surface">All notifications</h3>
          <p className="text-xs text-on-surface-variant mt-1">{unreadCount} unread notification(s).</p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 text-xs text-on-error-container">
            {error}
          </div>
        ) : null}

        <NotificationsPanel
          notifications={notifications}
          loading={loading}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
          onDelete={handleDelete}
          busyId={busyId}
          busyDeleteId={busyDeleteId}
          markAllBusy={markAllBusy}
        />
      </section>
    </div>
  );
}
