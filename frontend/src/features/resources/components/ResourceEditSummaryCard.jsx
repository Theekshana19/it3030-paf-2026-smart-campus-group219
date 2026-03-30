import SmartAvailabilityBadge from './SmartAvailabilityBadge.jsx';

const FALLBACK_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBCr6ac113aaiWCmFkLxJHJaCJ4YDWvWX9w_bXOmfEMtciha_OQ7EZePCIqDZmdR64TRpUvLJ_mNYPTJ1UW0y-ClyD1HdRY6NuLfeCafees0f7Lf0EGDK-mGl0INALEe8gbLWVJPXoeEe_dV3A75dxNn7DJGo8lHezMWJMOnCzvj9ge1WbRi8-rID6xArT6Im-9VBFzT9bcsx9EoPKmkWuKWaP6DBL9fuGWYMwVxCPXCLTIldC0UKqm14Ms7_dXuKJWK_NSN6ogFAW0';

/**
 * @param {{
 *  resourceName: string;
 *  resourceCode: string;
 *  smartAvailabilityStatus?: string | null;
 *  nextBookingTime?: string | null;
 *  building?: string | null;
 *  floor?: string | null;
 *  capacity?: number | null;
 *  updatedAt?: string | null;
 *  updatedBy?: string | null;
 *  imageUrl?: string | null;
 * }} props
 */
export default function ResourceEditSummaryCard({
  resourceName,
  resourceCode,
  smartAvailabilityStatus,
  nextBookingTime,
  building,
  floor,
  capacity,
  updatedAt,
  updatedBy,
  imageUrl,
}) {
  const img = imageUrl ?? FALLBACK_IMAGE;

  const updatedLabel = updatedAt
    ? (() => {
        const d = new Date(updatedAt);
        if (Number.isNaN(d.getTime())) return 'Last updated: —';
        return `Last updated: ${d.toLocaleString()}`;
      })()
    : 'Last updated: —';

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col sm:flex-row gap-6 items-center lg:h-[188px]">
      <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-xl overflow-hidden shadow-inner flex-shrink-0 bg-surface-container-lowest">
        <img alt={resourceName} className="w-full h-full object-cover" src={img} />
      </div>

      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2 justify-center sm:justify-start">
          <h2 className="text-2xl font-bold font-manrope text-on-surface">{resourceName}</h2>
          <span className="hidden sm:inline-flex">
            <SmartAvailabilityBadge status={smartAvailabilityStatus} nextBookingTime={nextBookingTime} />
          </span>
        </div>

        <p className="text-on-surface-variant text-sm mb-4">
          {building ? building : 'Building —'}
          {floor ? ` • Level ${floor}` : ''}
          {capacity != null ? ` • ${capacity} Capacity` : ''}
        </p>

        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          <div className="flex items-center gap-2 text-xs text-secondary font-body">
            <span className="material-symbols-outlined text-sm">update</span>
            {updatedLabel}
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary font-body">
            <span className="material-symbols-outlined text-sm">person</span>
            By: {updatedBy ?? '—'} {resourceCode ? `(Code: ${resourceCode})` : null}
          </div>
        </div>

        <div className="sm:hidden mt-4">
          <SmartAvailabilityBadge status={smartAvailabilityStatus} nextBookingTime={nextBookingTime} />
        </div>
      </div>
    </div>
  );
}

