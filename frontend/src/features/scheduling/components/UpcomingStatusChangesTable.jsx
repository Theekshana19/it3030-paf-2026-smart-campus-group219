import Icon from '../../../components/common/Icon.jsx';
import UpcomingStatusChangeRow from './UpcomingStatusChangeRow.jsx';

function LoadingRows() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="animate-pulse border-b border-outline-variant/5">
      <td className="px-6 py-5"><div className="h-4 w-36 bg-surface-container rounded" /></td>
      <td className="px-6 py-5"><div className="h-4 w-24 bg-surface-container rounded" /></td>
      <td className="px-6 py-5"><div className="h-4 w-28 bg-surface-container rounded" /></td>
      <td className="px-6 py-5"><div className="h-6 w-24 bg-surface-container rounded-full" /></td>
      <td className="px-6 py-5"><div className="h-5 w-5 bg-surface-container rounded-full" /></td>
      <td className="px-6 py-5"><div className="h-8 w-8 bg-surface-container rounded-full ml-auto" /></td>
    </tr>
  ));
}

/**
 * @param {{
 *   rows: Array<Record<string, any>>;
 *   loading?: boolean;
 * }} props
 */
export default function UpcomingStatusChangesTable({ rows, loading = false }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(23,28,31,0.04)] overflow-hidden border border-white">
      <div className="px-6 py-5 border-b border-surface-container flex items-center justify-between bg-white/50">
        <h2 className="text-xl font-bold font-manrope">Upcoming Status Changes</h2>
        <button type="button" className="text-primary text-sm font-semibold hover:underline">
          View All Records
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50">
              <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest">Resource</th>
              <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest">Building</th>
              <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest">Schedule</th>
              <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest">Target Status</th>
              <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest">Conflict</th>
              <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {loading ? <LoadingRows /> : null}
            {!loading && rows.map((row) => <UpcomingStatusChangeRow key={`${row.scheduleId}-${row.resourceId}`} row={row} />)}
            {!loading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="inline-flex flex-col items-center gap-2 text-on-surface-variant">
                    <Icon name="calendar_month" className="text-4xl" />
                    <p className="font-semibold">No schedule records found</p>
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
