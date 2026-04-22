import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ loading?: boolean; result: { totalRequested?: number; noConflictCount?: number; conflictCount?: number; noConflictResourceIds?: number[]; conflicts?: { resourceId: number; message: string }[] } | null }} props
 */
export default function ScheduleConflictPreview({ loading, result }) {
  if (loading) {
    return (
      <section className="p-4 bg-surface-container-low rounded-xl border border-surface-container flex gap-3 items-center text-sm text-on-surface-variant">
        <Icon name="hourglass_top" className="text-lg" />
        Checking for overlaps…
      </section>
    );
  }
  if (!result) {
    return (
      <section className="p-4 bg-surface-container-low/60 rounded-xl border border-dashed border-surface-container text-xs text-on-surface-variant">
        Select resources and a time window to preview conflicts.
      </section>
    );
  }

  const conflicts = Array.isArray(result.conflicts) ? result.conflicts : [];
  const clear = Array.isArray(result.noConflictResourceIds) ? result.noConflictResourceIds : [];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/80">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="verified" className="text-emerald-700 text-lg" />
          <h4 className="text-sm font-bold text-emerald-900">Clear ({clear.length})</h4>
        </div>
        {clear.length ? (
          <p className="text-xs text-emerald-900/80 leading-relaxed break-words">{clear.join(', ')}</p>
        ) : (
          <p className="text-xs text-emerald-900/70">No resources in the clear bucket for this window.</p>
        )}
      </div>
      <div className="p-4 rounded-xl border border-error/20 bg-error-container/15">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="warning" className="text-error text-lg" />
          <h4 className="text-sm font-bold text-on-error-container">Conflicts ({conflicts.length})</h4>
        </div>
        {conflicts.length ? (
          <ul className="space-y-2 text-xs text-on-error-container/90">
            {conflicts.map((c) => (
              <li key={`${c.resourceId}-${c.message}`} className="leading-snug">
                <span className="font-semibold">#{c.resourceId}</span>
                {c.message ? <span>: {c.message}</span> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-on-error-container/80">No blocking conflicts detected for this window.</p>
        )}
      </div>
    </section>
  );
}
