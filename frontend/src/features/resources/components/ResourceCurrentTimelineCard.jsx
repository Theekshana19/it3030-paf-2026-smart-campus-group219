function toMinutes(t) {
  const [hh, mm] = String(t || '00:00').slice(0, 5).split(':').map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

/**
 * @param {{ segments: {start:string;end:string;type:'AVAILABLE'|'BOOKED'|'BUFFER';label?:string;}[] }} props
 */
export default function ResourceCurrentTimelineCard({ segments }) {
  const dayStart = 8 * 60;
  const dayEnd = 20 * 60;
  const total = dayEnd - dayStart;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowPct = Math.min(100, Math.max(0, ((nowMins - dayStart) / total) * 100));

  const colorFor = (type) =>
    type === 'BOOKED' ? 'bg-primary-container' : type === 'BUFFER' ? 'bg-surface-container-high' : 'bg-tertiary-fixed';

  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-outline-variant/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline text-lg font-bold text-on-surface">Current Status Timeline (Today)</h3>
        <div className="flex items-center gap-4 text-xs font-medium text-secondary">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-tertiary-fixed" /> Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary-container" /> Booked</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-surface-container-high" /> Buffer</span>
        </div>
      </div>
      <div className="relative h-20 bg-surface-container rounded-lg flex items-center px-2">
        <div className="absolute inset-x-0 -top-6 flex justify-between px-2 text-[10px] text-secondary font-medium">
          {['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((t) => <span key={t}>{t}</span>)}
        </div>
        <div className="absolute h-full w-0.5 bg-error z-10" style={{ left: `${nowPct}%` }}>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-error text-white text-[10px] px-1.5 py-0.5 rounded">
            {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
          </div>
        </div>
        <div className="w-full h-12 flex rounded-md overflow-hidden ring-1 ring-outline-variant/20">
          {segments.map((s, idx) => {
            const start = Math.max(dayStart, toMinutes(s.start));
            const end = Math.min(dayEnd, toMinutes(s.end));
            const width = `${Math.max(0, ((end - start) / total) * 100)}%`;
            return <div key={`${s.start}-${s.end}-${idx}`} className={`h-full ${colorFor(s.type)} border-r border-white/20`} style={{ width }} title={s.label || `${s.start}-${s.end}`} />;
          })}
        </div>
      </div>
    </section>
  );
}

