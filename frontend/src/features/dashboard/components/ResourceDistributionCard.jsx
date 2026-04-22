import Icon from '../../../components/common/Icon.jsx';

const STYLE_BY_TYPE = {
  LECTURE_HALL: {
    icon: 'school',
    iconClass: 'text-primary',
    grad: 'from-primary/20',
    bar: 'bg-primary',
    value: 'text-primary',
  },
  LAB: {
    icon: 'biotech',
    iconClass: 'text-tertiary',
    grad: 'from-tertiary/20',
    bar: 'bg-tertiary',
    value: 'text-tertiary',
  },
  MEETING_ROOM: {
    icon: 'groups',
    iconClass: 'text-secondary',
    grad: 'from-secondary/20',
    bar: 'bg-secondary',
    value: 'text-secondary',
  },
  EQUIPMENT: {
    icon: 'devices',
    iconClass: 'text-[#ea580c]',
    grad: 'from-[#ea580c]/20',
    bar: 'bg-[#ea580c]',
    value: 'text-[#ea580c]',
  },
};

export default function ResourceDistributionCard({ item, maxCount, loading }) {
  const style = STYLE_BY_TYPE[item?.resourceType] ?? STYLE_BY_TYPE.LECTURE_HALL;
  const count = Number(item?.count ?? 0);
  const width = maxCount > 0 ? Math.max(8, Math.round((count / maxCount) * 100)) : 0;
  return (
    <article className="space-y-4">
      <div className="h-40 w-full bg-surface-container-low rounded-xl relative overflow-hidden flex flex-col justify-end p-4">
        <div className={`absolute inset-0 bg-gradient-to-t ${style.grad} to-transparent`} />
        <div className="relative z-10">
          <Icon name={style.icon} className={`${style.iconClass} mb-2`} />
          <h4 className="text-sm font-bold text-on-surface">{item?.label ?? '-'}</h4>
          {loading ? (
            <div className="mt-1 h-7 w-14 rounded-md bg-surface-container animate-pulse" />
          ) : (
            <p className={`text-3xl leading-none font-headline font-extrabold ${style.value}`}>{count}</p>
          )}
        </div>
      </div>
      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
        <div className={`${style.bar} h-full rounded-full`} style={{ width: `${width}%` }} />
      </div>
    </article>
  );
}
