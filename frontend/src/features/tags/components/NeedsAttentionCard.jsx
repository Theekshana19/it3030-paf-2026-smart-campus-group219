import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ untaggedCount?: number; loading?: boolean; onViewResources?: () => void }} props
 */
export default function NeedsAttentionCard({ untaggedCount = 0, loading, onViewResources }) {
  return (
    <section className="bg-amber-50/90 rounded-xl border border-amber-200/80 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] p-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="warning" className="text-amber-700 text-xl" />
        <h3 className="font-headline text-base font-bold text-amber-950">Needs Attention</h3>
      </div>
      <p className="text-sm text-amber-900/90 font-body leading-relaxed mb-4">
        {loading ? (
          'Loading…'
        ) : (
          <>
            <span className="font-bold text-lg tabular-nums">{untaggedCount}</span> resource
            {untaggedCount === 1 ? '' : 's'} currently have no tags assigned.
          </>
        )}
      </p>
      <button
        type="button"
        onClick={onViewResources}
        disabled={loading}
        className="w-full py-2.5 px-4 rounded-lg bg-white border border-amber-300 text-amber-950 text-sm font-bold font-manrope hover:bg-amber-100/80 transition-colors disabled:opacity-50"
      >
        View Resources
      </button>
    </section>
  );
}
