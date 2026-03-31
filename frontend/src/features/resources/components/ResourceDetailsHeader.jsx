import Icon from '../../../components/common/Icon.jsx';
import ResourceStatusPill from './ResourceStatusPill.jsx';

/**
 * @param {{
 *  breadcrumbCategory: string;
 *  breadcrumbLabel: string;
 *  resourceName?: string;
 *  locationText?: string;
 *  smartAvailabilityStatus?: string | null;
 *  nextBookingTime?: string | null;
 * }} props
 */
export default function ResourceDetailsHeader({
  breadcrumbCategory,
  breadcrumbLabel,
  resourceName,
  locationText,
  smartAvailabilityStatus,
  nextBookingTime,
}) {
  return (
    <section className="space-y-4">
      <nav className="flex items-center gap-2 text-xs font-label text-on-surface-variant tracking-wider uppercase">
        <span>Catalogue</span>
        <Icon name="chevron_right" className="text-[12px]" />
        <span>{breadcrumbCategory}</span>
        <Icon name="chevron_right" className="text-[12px]" />
        <span className="text-on-surface font-bold">{breadcrumbLabel}</span>
      </nav>
      <div className="space-y-2">
        <ResourceStatusPill status={smartAvailabilityStatus} nextBookingTime={nextBookingTime} />
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
          Resource Details: {resourceName || 'Resource'}
        </h1>
        <p className="text-secondary font-body flex items-center gap-2">
          <Icon name="location_on" className="text-sm" />
          {locationText || 'Location not set'}
        </p>
      </div>
    </section>
  );
}

