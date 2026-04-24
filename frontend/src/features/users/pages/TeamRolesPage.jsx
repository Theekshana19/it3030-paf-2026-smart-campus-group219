import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as usersApi from '../api/usersApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

const ROLES = ['USER', 'TECHNICIAN', 'ADMIN'];

export default function TeamRolesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersApi.listUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(getErrorMessage(e) || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRoleChange = async (userId, role) => {
    setSavingId(userId);
    try {
      const updated = await usersApi.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => (u.userId === userId ? { ...u, ...updated } : u)));
      toast.success('Role updated');
    } catch (e) {
      toast.error(getErrorMessage(e) || 'Could not update role');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="p-8 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8 flex items-start gap-4">
        <span className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon name="group" className="text-2xl" />
        </span>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Team & roles</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-body max-w-2xl">
            Assign USER, TECHNICIAN, or ADMIN. Technicians can use ticket assignment actions; admins manage resources
            and bookings.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden">
        {loading ? (
          <p className="p-8 text-sm text-on-surface-variant font-body">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="p-8 text-sm text-on-surface-variant font-body">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-surface-container-low text-left text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {users.map((u) => (
                  <tr key={u.userId} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3 font-medium text-on-surface">{u.displayName ?? '—'}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{u.email}</td>
                    <td className="px-4 py-3">
                      <select
                        className="border border-outline-variant rounded-lg px-2 py-1.5 text-sm bg-white min-w-[140px]"
                        value={u.role ?? 'USER'}
                        disabled={savingId === u.userId}
                        onChange={(e) => handleRoleChange(u.userId, e.target.value)}
                        aria-label={`Role for ${u.email}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{u.isActive === false ? 'No' : 'Yes'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
