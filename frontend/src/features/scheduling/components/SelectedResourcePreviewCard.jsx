import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *  resource?: {
 *    resourceName:string;resourceCode:string;building:string;floor?:string;roomOrAreaIdentifier?:string;status?:string;
 *  } | null;
 * }} props
 */
export default function SelectedResourcePreviewCard({ resource }) {
  if (!resource) return null;

  const location = [resource.building, resource.floor, resource.roomOrAreaIdentifier].filter(Boolean).join(', ');
  const isActive = String(resource.status || '').toUpperCase() === 'ACTIVE';

  return (
    <div className="p-4 bg-surface-container rounded-xl border border-outline-variant/15 flex gap-4 shadow-[0_10px_24px_-16px_rgba(23,28,31,0.3)]">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container-high shrink-0 flex items-center justify-center">
        <Icon name="meeting_room" className="text-2xl text-on-surface-variant" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-bold text-on-surface truncate">{resource.resourceName}</h4>
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
              isActive ? 'bg-tertiary-container/10 text-tertiary' : 'bg-error-container text-on-error-container'
            }`}
          >
            {isActive ? 'Active' : 'Out of service'}
          </span>
        </div>
        <p className="text-[11px] text-on-surface-variant mt-0.5">Code: {resource.resourceCode}</p>
        <p className="text-[11px] text-on-surface-variant">{location || 'Campus location not set'}</p>
      </div>
    </div>
  );
}
