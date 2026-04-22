import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ items?: { tagId: number; tagName: string; tagColor?: string; usageCount: number }[]; loading?: boolean }} props
 */
export default function MostUsedTagsCard({ items = [], loading }) {
  return (
    <section className="bg-white rounded-xl border border-outline-variant/15 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-headline text-base font-bold text-on-surface">Most Used Tags</h3>
        <Icon name="trending_up" className="text-primary text-xl" />
      </div>
      {loading ? (
        <p className="text-sm text-on-surface-variant font-body">Loading…</p>
      ) : !items.length ? (
        <p className="text-sm text-on-surface-variant font-body">No tag usage yet. Assign tags to resources to see analytics.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li key={t.tagId} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full shrink-0 ring-2 ring-white shadow-sm"
                style={{ backgroundColor: t.tagColor || '#94A3B8' }}
                aria-hidden
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{t.tagName}</p>
                <p className="text-xs text-on-surface-variant">{t.usageCount} mapped</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
