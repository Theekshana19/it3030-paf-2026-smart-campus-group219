import Icon from '../../../components/common/Icon.jsx';

const PREVIEW_IMG = '/images/live-preview.webp';

/**
 * @param {{
 *   resourceName: string;
 *   resourceCode: string;
 *   building: string;
 *   roomOrAreaIdentifier: string;
 *   floor: string;
 *   status: 'ACTIVE'|'OUT_OF_SERVICE';
 *   capacity: string | number;
 *   fromTime: string;
 *   toTime: string;
 *   lastModifiedLabel?: string;
 * }} props
 */
export default function LivePreviewCard({
  resourceName,
  resourceCode,
  building,
  roomOrAreaIdentifier,
  floor,
  status,
  capacity,
  fromTime,
  toTime,
  lastModifiedLabel = 'Just Now',
}) {
  const locationParts = [building, roomOrAreaIdentifier, floor].filter(Boolean);
  const location =
    locationParts.length > 0
      ? locationParts.join(' • ')
      : 'Location not set';

  const hours =
    fromTime && toTime
      ? `${fromTime.slice(0, 5)}-${toTime.slice(0, 5)}`
      : '—';

  const capLabel =
    capacity === '' || capacity === undefined || capacity === null
      ? '—'
      : `${capacity} Pers.`;

  const displayName = resourceName?.trim() || 'New resource';
  const code = resourceCode?.trim() || '—';

  return (
    <div className="bg-inverse-surface rounded-2xl p-6 md:p-7 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-tertiary/20 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-7">
          <span className="px-3 py-1 bg-tertiary/20 text-tertiary-fixed rounded-full text-[10px] font-bold uppercase tracking-widest border border-tertiary/30">
            Live Preview
          </span>
          <Icon name="visibility" className="text-outline-variant" />
        </div>
        <div className="bg-surface-container-lowest/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-6">
          <div className="h-40 w-full rounded-lg mb-4 overflow-hidden grayscale-[0.2] opacity-90 transition-all hover:grayscale-0">
            <img alt="Facility preview" className="w-full h-full object-cover" src={PREVIEW_IMG} />
          </div>
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h4 className="font-headline font-bold text-xl leading-snug truncate tracking-tight">{displayName}</h4>
              <p className="text-outline-variant text-xs mt-1 font-body line-clamp-2">{location}</p>
            </div>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                status === 'ACTIVE'
                  ? 'bg-tertiary/30 text-[#89f5e7]'
                  : 'bg-error/30 text-error-container'
              }`}
            >
              {status === 'ACTIVE' ? 'Active' : 'Out of Service'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-2.5 flex items-center gap-2">
              <Icon name="groups" className="text-primary-fixed-dim text-lg" />
              <div>
                <p className="text-[9px] uppercase font-bold text-outline-variant font-label">Capacity</p>
                <p className="text-sm font-semibold">{capLabel}</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-2.5 flex items-center gap-2">
              <Icon name="history_toggle_off" className="text-tertiary-fixed-dim text-lg" />
              <div>
                <p className="text-[9px] uppercase font-bold text-outline-variant font-label">Hours</p>
                <p className="text-sm font-semibold">{hours}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2 items-center">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[65%] rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-primary-fixed leading-none shrink-0">65% Util.</span>
          </div>
        </div>
        <div className="space-y-4">
          <h5 className="text-[10px] font-bold uppercase tracking-widest text-outline-variant">
            Meta Information
          </h5>
          <div className="flex items-center justify-between text-xs py-2 border-b border-white/5 gap-2">
            <span className="text-outline-variant shrink-0">System Code</span>
            <span className="font-mono text-primary-fixed text-right truncate">{code}</span>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
            <span className="text-outline-variant">Last Modified</span>
            <span>{lastModifiedLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
