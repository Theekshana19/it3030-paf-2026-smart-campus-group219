import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../auth/hooks/useAuth.js';
import {
  getUnreadCount,
  listNotifications,
  markAllAsRead,
  markAsRead,
} from '../api/notificationsApi';

const POLL_INTERVAL_MS = 30_000;

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Reset when logged out; poll unread count when authenticated
  useEffect(() => {
    if (!user?.userId) {
      setUnreadCount(0);
      setNotifications([]);
      setOpen(false);
      return undefined;
    }

    const fetchCount = () => {
      getUnreadCount()
        .then((data) => setUnreadCount(data.unreadCount ?? 0))
        .catch((err) => {
          console.error('Failed to fetch unread count:', err);
        });
    };
    fetchCount();
    const id = setInterval(fetchCount, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [user?.userId]);

  // Close panel on outside click
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (!panelRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  const handleOpen = useCallback(() => {
    setOpen((prev) => {
      if (prev) return false;
      setLoading(true);
      listNotifications()
        .then((data) => {
          setNotifications(data);
        })
        .catch((err) => {
          console.error('Failed to fetch notifications:', err);
        })
        .finally(() => setLoading(false));
      return true;
    });
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleMarkRead = useCallback((id) => {
    markAsRead(id)
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n.notificationId === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      })
      .catch((err) => {
        console.error('Failed to mark notification as read:', err);
      });
  }, []);

  const handleMarkAllRead = useCallback(() => {
    markAllAsRead()
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      })
      .catch((err) => {
        console.error('Failed to mark all notifications as read:', err);
      });
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    open,
    panelRef,
    handleOpen,
    handleClose,
    handleMarkRead,
    handleMarkAllRead,
  };
}
