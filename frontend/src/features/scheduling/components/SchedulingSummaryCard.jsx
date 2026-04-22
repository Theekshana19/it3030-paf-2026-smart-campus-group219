import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   title: string;
 *   value: number|string;
 *   note?: string;
 *   icon: string;
 *   tone?: 'primary'|'orange'|'red'|'amber';
 * }} props
 */
export default function SchedulingSummaryCard({ title, value, note, icon, tone = 'primary' }) {
  const toneClass = {
    primary: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-error',
    amber: 'bg-amber-50 text-amber-600',
  }[tone];
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_32px_rgba(23,28,31,0.04)] flex flex-col gap-4 border border-white">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${toneClass}`}>
        <Icon name={icon} />
      </div>
      <div>
        <p className="font-bold text-on-surface-variant uppercase tracking-widest text-[10px]">{title}</p>
        <h3 className="text-3xl font-bold font-manrope mt-1">{value}</h3>
      </div>
      {note ? <p className="text-xs text-secondary">{note}</p> : null}
    </div>
  );
}
