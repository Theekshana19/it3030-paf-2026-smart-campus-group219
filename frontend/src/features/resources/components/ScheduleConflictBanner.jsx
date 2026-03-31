import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   conflict: null | { title: string; message: string };
 *   onViewConflict?: () => void;
 * }} props
 */
export default function ScheduleConflictBanner({ conflict, onViewConflict }) {
  if (!conflict) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg flex items-start gap-4">
      <Icon name="warning" className="text-orange-600 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-bold text-orange-900">{conflict.title}</h4>
        <p className="text-xs text-orange-800 leading-relaxed">{conflict.message}</p>
      </div>
      <button
        type="button"
        className="text-orange-900 font-bold text-xs hover:underline"
        onClick={onViewConflict}
      >
        View Conflict
      </button>
    </div>
  );
}

