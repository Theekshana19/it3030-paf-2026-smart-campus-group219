import Icon from '../../../components/common/Icon.jsx';

const MAP_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA4Kaz8nfkKxiJX7SftdM1L4W0XX-05ZsaFVt0hwWNqC_iR4oPQt5i6xXLy18WAnHspPTZ9kkoWePs-wKXXOL1QNyJUtZMzspRogW7er8deLOsrnoQq7_EopJrgHqW_b1mCmSxs8frB0uISd6EbzQruIoKCFU5ZlbAIFvG28_QgVKcoUmMbtm_ZK7WSBEn_S5yGI7Le0eQa9yGingV2VMw3E5T0rHM4io5tClPc9fNarLeR4tYDgCo1Ug50ggEz2i_hYDOjOMmT-GXH';

export default function CampusMapPreviewCard({ onExplore }) {
  return (
    <section className="rounded-xl overflow-hidden relative h-48 shadow-[0_20px_30px_-8px_rgba(23,28,31,0.25)]">
      <img src={MAP_IMAGE} alt="Campus map preview" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
        <button
          type="button"
          onClick={onExplore}
          className="bg-white text-on-surface px-4 py-2 rounded-full text-xs font-bold shadow-xl flex items-center gap-2"
        >
          <Icon name="map" className="text-sm" />
          Explore Campus Map
        </button>
      </div>
    </section>
  );
}
