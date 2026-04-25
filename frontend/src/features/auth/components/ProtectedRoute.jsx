import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * allowedRoles      – user.role must be one of these strings
 * requiredPermission – user.permissions must include this code
 * requireAny        – user.permissions must include at least one of these codes
 */
export default function ProtectedRoute({ allowedRoles, requiredPermission, requireAny }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  const perms = user?.permissions ?? [];

  if (requiredPermission && !perms.includes(requiredPermission)) {
    return <Navigate to="/" replace />;
  }

  if (requireAny && !requireAny.some((p) => perms.includes(p))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  requiredPermission: PropTypes.string,
  requireAny: PropTypes.arrayOf(PropTypes.string),
};
