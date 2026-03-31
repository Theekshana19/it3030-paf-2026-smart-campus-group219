import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ item: {title:string;sub:string;who:string;when:string;icon:string;tone?:string;} }} props
 */
export default function ActivityLogItem({ item }) {
  const toneClass =
    item.tone === 'tertiary'
      ? 'bg-tertiary-fixed text-tertiary-container'
      : item.tone === 'neutral'
        ? 'bg-surface-container-highest text-on-surface-variant'
        : 'bg-secondary-container text-primary';

  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-container transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toneClass}`}>
          <Icon name={item.icon} />
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">{item.title}</p>
          <p className="text-xs text-secondary">{item.sub}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium text-on-surface-variant">{item.who}</p>
        <p className="text-[10px] text-secondary">{item.when}</p>
      </div>
    </div>
  );
}

