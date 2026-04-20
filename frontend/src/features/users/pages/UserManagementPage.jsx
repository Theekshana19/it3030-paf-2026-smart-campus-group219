import { useCallback, useEffect, useState } from 'react';
import { getUsers, updateUserRole } from '../api/usersApi.js';

const ROLE_OPTIONS = ['USER', 'ADMIN', 'TECHNICIAN'];

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyUserId, setBusyUserId] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load users.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = useCallback(async (userId, role) => {
    setBusyUserId(userId);
    setError('');
    try {
      const updated = await updateUserRole(userId, role);
      setUsers((prev) =>
        prev.map((user) => (user.userId === userId ? { ...user, ...updated, role: updated.role ?? role } : user))
      );
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update role.');
    } finally {
      setBusyUserId(null);
    }
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto w-full space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">
          User management
        </h2>
        <p className="text-sm md:text-base text-on-surface-variant font-body">
          Review users and assigned roles across the platform.
        </p>
      </div>

      <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 md:p-6">
        {error ? (
          <div className="mb-4 rounded-lg border border-error/30 bg-error-container/40 px-3 py-2 text-xs text-on-error-container">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-outline-variant/30 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-surface-container text-on-surface-variant">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Name</th>
                <th className="text-left font-semibold px-4 py-3">Email</th>
                <th className="text-left font-semibold px-4 py-3">Role</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-on-surface-variant" colSpan={4}>
                    Loading users...
                  </td>
                </tr>
              ) : users.length ? (
                users.map((user) => (
                  <tr key={user.userId} className="border-t border-outline-variant/20">
                    <td className="px-4 py-3 text-on-surface font-medium">{user.displayName}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{user.email}</td>
                    <td className="px-4 py-3 text-on-surface">
                      <select
                        className="rounded-md border border-outline-variant/50 px-2.5 py-1.5 bg-white text-sm"
                        value={user.role ?? 'USER'}
                        onChange={(e) => handleRoleChange(user.userId, e.target.value)}
                        disabled={busyUserId === user.userId}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          user.isActive
                            ? 'bg-[#e7f8ed] text-[#17693a]'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-on-surface-variant" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
