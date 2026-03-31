/**
 * @param {{ label?: string }} props
 */
export default function ResourceLocationMapCard({ label = 'Building Map' }) {
  return (
    <div className="aspect-video bg-surface-container-highest relative">
      <img
        className="w-full h-full object-cover grayscale opacity-50"
        alt={label}
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbybddMBS5JXIFuPp1u2b4Bjfjvr5HaGzumfkmOBUastqhpd784-WOrgiGugXyUBmR1B1t5SSDeWMdhx1lkPvRcYWd6P3BgqwQgKwg90CnIwDfw8kapr8GrpWriIZmWRL3Kc9pIbZPiD_PP7gO5GKZHtaO76JAgkEv1TBj8kskqCwFPUkGp4VosMxS8bo3cz610djoRs-Gm6l2Qwj5F7p159fjdDtA2qW212iiB-QeCJMzb9FFt-dBxMZ-2vNSkIEk5mtzp65bxpLX"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-primary text-white p-2 rounded-full shadow-lg ring-4 ring-primary/20 animate-pulse">
          <span className="material-symbols-outlined">location_on</span>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-surface-container-lowest/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-on-surface-variant">
        {label}
      </div>
    </div>
  );
}

