import Icon from '../../../components/common/Icon.jsx';
import ToggleSwitch from './ToggleSwitch.jsx';

/**
 * @param {{
 *  value: { forceGlobalOverride: boolean; autoRejectOverlaps: boolean; notifyAllOccupants: boolean };
 *  onChange: (next: { forceGlobalOverride: boolean; autoRejectOverlaps: boolean; notifyAllOccupants: boolean }) => void;
 * }} props
 */
export default function AdminControlsCard({ value, onChange }) {
  const set = (key) => (checked) => onChange({ ...value, [key]: checked });

  return (
    <section className="bg-secondary rounded-xl p-6 text-white">
      <h3 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
        <Icon name="verified_user" className="text-indigo-300" />
        Admin Controls
      </h3>
      <ul className="space-y-4">
        <li className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-200">Force Global Override</span>
          <ToggleSwitch checked={value.forceGlobalOverride} onChange={set('forceGlobalOverride')} />
        </li>
        <li className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-200">Auto-Reject Overlaps</span>
          <ToggleSwitch checked={value.autoRejectOverlaps} onChange={set('autoRejectOverlaps')} />
        </li>
        <li className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-200">Notify All Occupants</span>
          <ToggleSwitch checked={value.notifyAllOccupants} onChange={set('notifyAllOccupants')} />
        </li>
      </ul>
      <div className="mt-6 pt-6 border-t border-white/10">
        <button
          type="button"
          className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors"
        >
          Export System Logs
        </button>
      </div>
    </section>
  );
}

