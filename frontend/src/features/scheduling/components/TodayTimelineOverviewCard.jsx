/**
 * @param {{ items: Array<{id: string; time: string; title: string; subtitle?: string; active?: boolean}>; loading?: boolean }} props
 */
export default function TodayTimelineOverviewCard({ items, loading = false }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_32px_rgba(23,28,31,0.04)] border border-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-base font-bold font-manrope">Today&apos;s Timeline</h2>
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live View</span>
      </div>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 bg-surface-container rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
          {items.map((item) => (
            <div key={item.id} className="pl-8 relative">
              <div
                className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white ${
                  item.active ? 'bg-indigo-600 ring-1 ring-indigo-100' : 'bg-slate-200'
                }`}
              />
              <p className={`text-[10px] font-bold uppercase tracking-widest ${item.active ? 'text-indigo-600' : 'text-slate-400'}`}>
                {item.time}
              </p>
              <p className="text-sm font-semibold mt-1">{item.title}</p>
              <p className="text-xs text-secondary">{item.subtitle}</p>
            </div>
          ))}
          {items.length === 0 ? <p className="text-sm text-on-surface-variant pl-2">No entries for today.</p> : null}
        </div>
      )}
    </div>
  );
}
