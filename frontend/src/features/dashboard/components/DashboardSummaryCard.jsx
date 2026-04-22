import Icon from '../../../components/common/Icon.jsx';

export default function DashboardSummaryCard({
  label,
  value,
  icon,
  iconWrapClass,
  iconClass,
  badge,
  badgeClass,
  loading,
}) {
  return (
    <article className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] min-h-[172px]">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${iconWrapClass}`}>
          <Icon name={icon} className={iconClass} />
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>{badge}</span>
      </div>
      <p className="text-secondary font-medium text-sm mb-1">{label}</p>
      {loading ? (
        <div className="h-9 w-24 rounded-lg bg-surface-container animate-pulse" />
      ) : (
        <h3 className="text-4xl leading-none font-headline font-extrabold text-on-surface">{value}</h3>
      )}
    </article>
  );
}
