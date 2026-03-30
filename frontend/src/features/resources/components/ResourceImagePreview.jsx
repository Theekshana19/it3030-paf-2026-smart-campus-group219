import Icon from '../../../components/common/Icon.jsx';

/**
 * Room map / digital twin preview card.
 * @param {{ label?: string; subtitle?: string }} props
 */
export default function ResourceImagePreview({ label = 'Locate on Digital Twin', subtitle }) {
  return (
    <div className="bg-surface-container rounded-xl h-48 relative overflow-hidden group shadow-sm border border-outline-variant/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5]/25 via-transparent to-[#3525cd]/20 transition-transform duration-300 group-hover:scale-[1.06]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.35)_0%,transparent_40%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-white text-xs font-bold">{label}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-white/80">{subtitle ?? 'Sector A • Zone 2'}</span>
          <span className="text-white/90">
            <Icon name="open_in_new" className="text-sm" />
          </span>
        </div>
      </div>
    </div>
  );
}

