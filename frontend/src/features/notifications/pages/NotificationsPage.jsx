import NotificationsPanel from '../components/NotificationsPanel.jsx';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Booking approved',
    message: 'Your booking request for Lab 2 has been approved.',
    createdAt: '2026-04-20T08:30:00Z',
  },
  {
    id: 2,
    title: 'Ticket updated',
    message: 'Technician marked your incident ticket as IN_PROGRESS.',
    createdAt: '2026-04-20T07:10:00Z',
  },
];

export default function NotificationsPage() {
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
          <p className="text-xs text-on-surface-variant mt-1">List rendering area (static data for now).</p>
        </div>

        <NotificationsPanel notifications={SAMPLE_NOTIFICATIONS} loading={false} />
      </section>
    </div>
  );
}
