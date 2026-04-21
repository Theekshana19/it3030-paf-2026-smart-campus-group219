import { useEffect, useMemo, useState } from 'react';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { getResourceById } from '../../features/resources/api/resourcesApi.js';
import NotificationsBell from '../../features/notifications/components/NotificationsBell.jsx';
import NotificationsPanel from '../../features/notifications/components/NotificationsPanel.jsx';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../features/notifications/api/notificationsApi.js';

const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCw25ZT-KYKlBFBrQ2CGdHDD9XiQnjngGoNOpNVSc2xA8RL7rWNPmaxwR5N_qTwJtYWmEHU35YGs8DQoJFHKF1Pvum8BnB64IhVe2HWIgcwPa2d0rfctOw2Vi-X42A1vQTFoB7Wf0Z-DtNGnF2Pl717OOAsX9hSywHgeTM7Iekl_UO6D_c_TZssF6y9yndSEymr_-S55cBBVQUSQhbw1Jzol3VquFA0dAiH19tn-SLdyLZrcx_9f8TMgCxcf2cMLF4oUHID1lk7VvOX';

export default function TopHeader() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const matches = useMatches();
  const crumb =
    [...matches].reverse().find((m) => m.handle?.crumb)?.handle?.crumb ?? 'Dashboard';

  const location = useLocation();
  const editResourceId = useMemo(() => {
    const m = location.pathname.match(/\/resources\/(\d+)\/edit$/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const [editName, setEditName] = useState(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [headerNotifications, setHeaderNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [busyDeleteId, setBusyDeleteId] = useState(null);
  const [markAllBusy, setMarkAllBusy] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setEditName(null);
      if (!editResourceId) return;
      try {
        const r = await getResourceById(editResourceId);
        if (!cancelled) setEditName(r?.resourceName ?? null);
      } catch {
        // Keep breadcrumb readable even when the fetch fails.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [editResourceId]);

  const headerLabel =
    editResourceId && editName ? `Edit Resource: ${editName}` : editResourceId ? 'Edit Resource' : crumb;
  const unreadCount = headerNotifications.filter((item) => !item.isRead).length;
  const hasSession = Boolean(currentUser?.googleToken ?? localStorage.getItem('googleToken'));

  useEffect(() => {
    let cancelled = false;
    if (!isNotificationsOpen || !hasSession) return;
    (async () => {
      setNotificationsLoading(true);
      try {
        const data = await getNotifications();
        if (!cancelled) {
          setHeaderNotifications(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) setHeaderNotifications([]);
      } finally {
        if (!cancelled) setNotificationsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNotificationsOpen, hasSession]);

  const handleMarkAsRead = async (notificationId) => {
    if (notificationId == null) return;
    setBusyId(notificationId);
    try {
      await markNotificationAsRead(notificationId);
      setHeaderNotifications((prev) =>
        prev.map((n) => ((n.notificationId ?? n.id) === notificationId ? { ...n, isRead: true } : n))
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkAllBusy(true);
    try {
      await markAllNotificationsAsRead();
      setHeaderNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } finally {
      setMarkAllBusy(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (notificationId == null) return;
    setBusyDeleteId(notificationId);
    try {
      await deleteNotification(notificationId);
      setHeaderNotifications((prev) => prev.filter((n) => (n.notificationId ?? n.id) !== notificationId));
    } finally {
      setBusyDeleteId(null);
    }
  };

  return (
    <header className="bg-[#f6fafe] shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-xl font-bold font-manrope text-[#3525cd] shrink-0">Campus Ops Hub</h1>
        <span className="mx-3 text-outline-variant shrink-0">/</span>
        <span className="text-sm font-medium text-secondary truncate">{headerLabel}</span>
      </div>
      <div className="flex items-center gap-5 shrink-0">
        <div className="relative hidden md:flex items-center bg-surface-container rounded-full px-4 py-2 focus-within:ring-2 ring-primary/20 transition-all">
          <Icon name="search" className="text-on-surface-variant mr-2 text-xl" />
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-52 lg:w-64 placeholder:text-on-surface-variant/60 font-body outline-none"
            placeholder="Search facilities..."
            type="search"
            aria-label="Search facilities"
          />
        </div>
        <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-5">
          <div className="relative">
            <NotificationsBell
              unreadCount={unreadCount}
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
            />
            {isNotificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[360px]">
                <NotificationsPanel
                  notifications={headerNotifications}
                  loading={notificationsLoading}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDelete={handleDeleteNotification}
                  busyId={busyId}
                  busyDeleteId={busyDeleteId}
                  markAllBusy={markAllBusy}
                />
                <button
                  type="button"
                  className="w-full text-xs font-medium text-primary bg-white border border-outline-variant/30 border-t-0 rounded-b-xl py-2"
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    navigate('/notifications');
                  }}
                >
                  View all notifications
                </button>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-[#eaeef2] transition-colors"
            aria-label="Help"
          >
            <Icon name="help" className="text-secondary" />
          </button>
          <div className="flex items-center gap-2.5 ml-1 cursor-pointer hover:bg-surface-container-low p-1.5 rounded-lg transition-all">
            <img
              alt="Admin"
              className="w-9 h-9 rounded-full border-2 border-primary/10 object-cover"
              src={currentUser?.profileImageUrl || AVATAR_SRC}
            />
            <Icon name="settings" className="text-secondary text-xl" />
          </div>
        </div>
      </div>
    </header>
  );
}
