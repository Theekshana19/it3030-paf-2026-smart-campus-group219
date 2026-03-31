import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ rows: {label:string; enabled:boolean; from:string; to:string; spanClass:string;}[] }} props
 */
export default function ResourceOperatingHoursCard({ rows }) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">Operating Hours</h3>
        <Icon name="schedule" className="text-primary-container" />
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <div className="flex items-center gap-3" key={row.label}>
            <span className="w-16 text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
              {row.label}
            </span>
            <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden flex">
              {row.enabled ? <div className={['h-full bg-primary-container', row.spanClass].join(' ')} /> : null}
            </div>
            {row.enabled ? (
              <span className="text-xs font-medium text-secondary">{row.from} - {row.to}</span>
            ) : (
              <span className="text-xs font-medium text-error">Closed</span>
            )}
          </div>
        ))}
        <p className="text-[10px] text-secondary mt-4 italic">
          * Special bookings available via department head approval.
        </p>
      </div>
    </section>
  );
}

