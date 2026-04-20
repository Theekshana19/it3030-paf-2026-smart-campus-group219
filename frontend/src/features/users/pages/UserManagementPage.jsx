const SAMPLE_USERS = [
  {
    id: 1,
    displayName: 'Nimal Perera',
    email: 'nimal@example.com',
    role: 'ADMIN',
    isActive: true,
  },
  {
    id: 2,
    displayName: 'Kavindi Silva',
    email: 'kavindi@example.com',
    role: 'USER',
    isActive: true,
  },
  {
    id: 3,
    displayName: 'Ravindu Fernando',
    email: 'ravindu@example.com',
    role: 'TECHNICIAN',
    isActive: false,
  },
];

export default function UserManagementPage() {
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
              {SAMPLE_USERS.map((user) => (
                <tr key={user.id} className="border-t border-outline-variant/20">
                  <td className="px-4 py-3 text-on-surface font-medium">{user.displayName}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{user.email}</td>
                  <td className="px-4 py-3 text-on-surface">{user.role}</td>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
