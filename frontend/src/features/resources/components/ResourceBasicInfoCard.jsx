import Icon from '../../../components/common/Icon.jsx';
import InfoRow from './InfoRow.jsx';

/**
 * @param {{ resource?: Record<string, any> | null }} props
 */
export default function ResourceBasicInfoCard({ resource }) {
  const safety = resource?.status === 'OUT_OF_SERVICE' ? 'Restricted' : 'BSL-2';
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">Basic Info & Capacity</h3>
        <Icon name="info" className="text-primary-container" />
      </div>
      <div className="space-y-1">
        <InfoRow label="Max Occupancy" value={resource?.capacity ? `${resource.capacity} Persons` : '—'} />
        <InfoRow label="Equipment Tier" value={resource?.equipmentSubtype || 'Level 1 (Standard)'} />
        <InfoRow
          label="Supervision Required"
          value={resource?.resourceType === 'LAB' || resource?.resourceType === 'EQUIPMENT' ? 'Yes' : 'No'}
        />
        <InfoRow
          label="Safety Grade"
          value={safety}
          valueClassName="px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold"
        />
      </div>
    </section>
  );
}

