import { Link } from 'react-router-dom';
import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ resourceId: number; onDelete: (id: number) => void; disabled?: boolean }} props
 */
export default function ResourceTableActions({ resourceId, onDelete, disabled = false }) {
  return (
    <div className="flex items-center justify-end gap-0.5 sm:gap-1 shrink-0">
      <Link
        to={`/resources/${resourceId}`}
        className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors"
        title="View details"
        aria-label="View details"
      >
        <Icon name="visibility" className="text-xl" />
      </Link>
      <Link
        to={`/resources/${resourceId}/edit`}
        className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors"
        title="Edit resource"
        aria-label="Edit resource"
      >
        <Icon name="edit" className="text-xl" />
      </Link>
      <Link
        to={`/resources/${resourceId}/schedules`}
        className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors"
        title="Schedule status"
        aria-label="Schedule status"
      >
        <Icon name="calendar_month" className="text-xl" />
      </Link>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onDelete(resourceId)}
        className="p-2 rounded-lg text-error hover:bg-error-container/30 transition-colors disabled:opacity-40"
        title="Delete resource"
        aria-label="Delete resource"
      >
        <Icon name="delete" className="text-xl" />
      </button>
    </div>
  );
}
