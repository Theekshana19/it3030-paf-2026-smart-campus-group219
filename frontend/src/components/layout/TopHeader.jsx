import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';
import Icon from '../common/Icon.jsx';
import { getResourceById } from '../../features/resources/api/resourcesApi.js';
import { useAuth } from '../../features/auth/hooks/useAuth.js';
import { useNotifications } from '../../features/notifications/hooks/useNotifications.js';
import NotificationPanel from '../../features/notifications/components/NotificationPanel.jsx';

const ROLE_BADGE = {
  ADMIN: { label: 'Admin', cls: 'bg-primary/10 text-primary' },
  TECHNICIAN: { label: 'Tech', cls: 'bg-tertiary/10 text-tertiary' },
  USER: { label: 'User', cls: 'bg-secondary/10 text-secondary' },
};

function UserAvatar({ user }) {
  if (user?.profileImageUrl) {
    return (
      <img
        alt={user.displayName ?? 'User'}
        className="w-9 h-9 rounded-full border-2 border-primary/10 object-cover"
        src={user.profileImageUrl}
      />
    );
  }
  const initials = (user?.displayName ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full border-2 border-primary/10 bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
      {initials}
    </div>
  );
}

export default function TopHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading: notifLoading,
    open: notifOpen,
    panelRef: notifPanelRef,
    handleOpen: openNotifPanel,
    handleMarkRead,
    handleMarkAllRead,
  } = useNotifications();
  const matches = useMatches();
  const crumb =
    [...matches].reverse().find((m) => m.handle?.crumb)?.handle?.crumb ?? 'Dashboard';

  const location = useLocation();
  const editResourceId = useMemo(() => {
    const m = location.pathname.match(/\/resources\/(\d+)\/edit$/);
    return m ? m[1] : null;
  }, [location.pathname]);

  const [editName, setEditName] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setEditName(null);
      if (!editResourceId) return;
      try {
        const r = await getResourceById(editResourceId);
        if (!cancelled) setEditName(r?.resourceName ?? null);
      } catch {
        // keep breadcrumb readable even when fetch fails
      }
    })();
    return () => { cancelled = true; };
  }, [editResourceId]);

  const headerLabel =
    editResourceId && editName ? `Edit Resource: ${editName}` : editResourceId ? 'Edit Resource' : crumb;

  // User menu dropdown
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const badge = user?.role ? ROLE_BADGE[user.role] ?? ROLE_BADGE.USER : null;

  return (
    <header className="bg-[#f6fafe] shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] flex justify-between items-center w-full px-8 py-4 sticky top-0 z-40">
      <div className="flex items-center gap-2 min-w-0">
        <h1 className="text-xl font-bold font-manrope text-[#3525cd] shrink-0">Campus Ops Hub</h1>
        <span className="mx-3 text-outline-variant shrink-0">/</span>
        <span className="text-sm font-medium text-secondary truncate">{headerLabel}</span>
      </div>

      <div className="flex items-center gap-5 shrink-0">
        {/* Search */}
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
          {/* Notification bell */}
          <div className="relative" ref={notifPanelRef}>
            <button
              type="button"
              onClick={openNotifPanel}
              className="p-2 rounded-full hover:bg-[#eaeef2] transition-colors relative"
              aria-label="Notifications"
            >
              <Icon name="notifications" className="text-secondary" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[1rem] h-4 bg-error rounded-full text-white text-[10px] font-bold flex items-center justify-center px-0.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <NotificationPanel
                notifications={notifications}
                loading={notifLoading}
                onMarkRead={handleMarkRead}
                onMarkAllRead={handleMarkAllRead}
              />
            )}
          </div>

          <button
            type="button"
            className="p-2 rounded-full hover:bg-[#eaeef2] transition-colors"
            aria-label="Help"
          >
            <Icon name="help" className="text-secondary" />
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 ml-1 hover:bg-surface-container-low p-1.5 rounded-lg transition-all"
              aria-label="User menu"
            >
              <UserAvatar user={user} />
              {badge && (
                <span className={`hidden md:inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                  {badge.label}
                </span>
              )}
              <Icon name="expand_more" className="text-secondary text-xl" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-outline-variant/30 py-1 z-50">
                <div className="px-4 py-2 border-b border-outline-variant/20">
                  <p className="text-sm font-semibold text-on-surface truncate">{user?.displayName}</p>
                  <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors"
                >
                  <Icon name="logout" className="text-base" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
