import { toast } from 'sonner';
import Icon from '../../../components/common/Icon.jsx';
import ToggleSwitch from './ToggleSwitch.jsx';

/**
 * Urgent Status Override card.
 * @param {{
 *  maintenanceEnabled: boolean;
 *  onMaintenanceEnabledChange: (v: boolean) => void;
 *  onBroadcast?: () => void;
 * }} props
 */
export default function OperationalStateCard({
  maintenanceEnabled,
  onMaintenanceEnabledChange,
  onBroadcast,
}) {
  const handleBroadcast = () => {
    try {
      onBroadcast?.();
    } catch {
      // ignore
    }
    toast.message('Broadcast Urgent Alert: coming soon');
  };

  return (
    <div className="bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between min-h-[188px]">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
      <div className="relative z-10">
        <p className="text-xs font-label uppercase tracking-widest opacity-80 mb-1">
          Operational State
        </p>
        <h3 className="text-lg font-bold font-manrope">Urgent Status Override</h3>
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm">Set Maintenance Mode</span>
          <ToggleSwitch checked={maintenanceEnabled} onChange={onMaintenanceEnabledChange} />
        </div>

        <button
          type="button"
          onClick={handleBroadcast}
          className="mt-4 w-full bg-white text-primary font-bold py-2 rounded-lg text-sm transition-transform active:scale-[0.98] hover:opacity-95 flex items-center justify-center gap-2"
        >
          <Icon name="notifications" className="text-lg" />
          Broadcast Urgent Alert
        </button>
      </div>
    </div>
  );
}

