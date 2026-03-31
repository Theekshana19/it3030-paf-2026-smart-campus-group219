/**
 * @param {{ utilization?: number | null; note?: string }} props
 */
export default function ResourceOptimizationCard({ utilization, note }) {
  const value = typeof utilization === 'number' ? Math.max(0, Math.min(100, utilization)) : 88;
  return (
    <section className="bg-primary text-white p-6 rounded-xl shadow-xl relative overflow-hidden group">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
      <div className="relative z-10">
        <h3 className="font-headline text-lg font-bold mb-2">Facility Optimization</h3>
        <p className="text-primary-fixed/80 text-sm mb-6 leading-relaxed">
          {note || 'This facility has high utilization this week. Consider scheduling routine maintenance on low-demand periods.'}
        </p>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-widest text-primary-fixed">
              <span>Utilization</span>
              <span>{value}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${value}%` }} />
            </div>
          </div>
          <button className="w-full bg-white text-primary font-manrope font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95" type="button">
            Generate Usage Report
          </button>
        </div>
      </div>
    </section>
  );
}

