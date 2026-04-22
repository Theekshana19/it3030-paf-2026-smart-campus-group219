import Icon from '../../../components/common/Icon.jsx';

const EMBED_MAP_URL =
  'https://www.google.com/maps?q=SLIIT%20Malabe%20Campus%2C%20Sri%20Lanka&z=16&output=embed';
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=SLIIT+Malabe+Campus%2C+Sri+Lanka';

export default function CampusMapPreviewCard({ onExplore }) {
  const handleExplore = () => {
    if (typeof onExplore === 'function') {
      onExplore();
      return;
    }
    window.open(GOOGLE_MAPS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="rounded-xl overflow-hidden relative h-48 shadow-[0_20px_30px_-8px_rgba(23,28,31,0.25)]">
      <iframe
        title="SLIIT Malabe campus map preview"
        src={EMBED_MAP_URL}
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
        <button
          type="button"
          onClick={handleExplore}
          className="bg-white text-on-surface px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2"
        >
          <Icon name="map" className="text-sm" />
          Explore Campus Map
        </button>
      </div>
    </section>
  );
}
