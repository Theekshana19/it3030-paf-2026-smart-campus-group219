import Icon from '../../../components/common/Icon.jsx';

const STYLE_BY_TYPE = {
  RESOURCE_STATUS_UPDATED: {
    wrap: 'bg-error-container text-error',
    icon: 'report_problem',
  },
  RESOURCE_CREATED: {
    wrap: 'bg-tertiary-container/20 text-tertiary-container',
    icon: 'add_box',
  },
  SCHEDULE_UPDATED: {
    wrap: 'bg-secondary-container text-on-secondary-container',
    icon: 'sync',
  },
};

function relativeTimeLabel(occurredAt) {
  if (!occurredAt) return 'just now';
  const ts = new Date(occurredAt).getTime();
  const diff = Date.now() - ts;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export default function RecentChangeItem({ item }) {
  const style = STYLE_BY_TYPE[item?.type] ?? STYLE_BY_TYPE.SCHEDULE_UPDATED;
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container transition-all">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${style.wrap}`}>
        <Icon name={style.icon} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-on-surface truncate">{item?.title ?? 'Update'}</h4>
        <p className="text-xs text-on-surface-variant truncate">{item?.description ?? ''}</p>
      </div>
      <p className="text-xs font-medium text-outline whitespace-nowrap">{relativeTimeLabel(item?.occurredAt)}</p>
    </div>
  );
}
