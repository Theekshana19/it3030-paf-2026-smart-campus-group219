import ActivityLogItem from './ActivityLogItem.jsx';

/**
 * @param {{ activities: {key:string;title:string;sub:string;who:string;when:string;icon:string;tone?:string;}[] }} props
 */
export default function ResourceRecentActivityCard({ activities }) {
  const safe = Array.isArray(activities) ? activities : [];
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-outline-variant/10">
      <h3 className="font-headline text-lg font-bold text-on-surface mb-6">Recent Activity Log</h3>
      {safe.length ? (
        <div className="space-y-1">
          {safe.map((a) => (
            <ActivityLogItem key={a.key} item={a} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-surface-container-low px-4 py-5 text-sm text-on-surface-variant">
          No recent activity available.
        </div>
      )}
      <button className="w-full mt-4 py-2 text-primary font-manrope font-bold text-xs hover:bg-primary/5 rounded-lg transition-all" type="button">
        View Full Audit Trail
      </button>
    </section>
  );
}

