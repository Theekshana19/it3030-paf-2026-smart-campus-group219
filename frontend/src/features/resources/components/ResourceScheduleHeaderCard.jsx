import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   resourceName?: string;
 *   resourceType?: string;
 *   currentStatus?: string;
 * }} props
 */
export default function ResourceScheduleHeaderCard({ resourceName, resourceType, currentStatus }) {
  const isActive = String(currentStatus ?? '').toUpperCase() === 'ACTIVE';
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl flex items-center gap-4 shadow-sm min-w-[240px]">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        <Icon name={resourceType === 'EQUIPMENT' ? 'handyman' : 'meeting_room'} className="text-3xl" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-on-surface truncate">{resourceName ?? 'Resource'}</p>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-tertiary' : 'bg-error'}`} />
          <p className="text-xs font-medium text-on-surface-variant">
            Current Status:{' '}
            <span className={isActive ? 'text-tertiary' : 'text-error'}>
              {isActive ? 'Active' : 'Out of service'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

