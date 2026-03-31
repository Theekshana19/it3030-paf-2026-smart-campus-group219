import Icon from '../../../components/common/Icon.jsx';
import ResourceLocationMapCard from './ResourceLocationMapCard.jsx';

/**
 * @param {{ zone?: string; note?: string; mapLabel?: string }} props
 */
export default function ResourceLocationAccessCard({ zone, note, mapLabel }) {
  return (
    <section className="bg-surface-container-lowest overflow-hidden rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-outline-variant/10">
      <div className="p-6">
        <h3 className="font-headline text-lg font-bold text-on-surface mb-4">Location & Access</h3>
        <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-container-low mb-4">
          <Icon name="door_front" className="text-primary mt-1" />
          <div>
            <p className="text-sm font-bold text-on-surface">Zone: {zone || 'Campus Zone'}</p>
            <p className="text-xs text-secondary">{note || 'Restricted access badge required after 18:00.'}</p>
          </div>
        </div>
      </div>
      <ResourceLocationMapCard label={mapLabel || 'Building Map'} />
    </section>
  );
}

