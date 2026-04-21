import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ hasConflict?: boolean }} props
 */
export default function ConflictIndicator({ hasConflict = false }) {
  if (hasConflict) {
    return <Icon name="warning" className="text-amber-500" aria-label="Conflict detected" />;
  }
  return <Icon name="check_circle" className="text-tertiary" aria-label="No conflict detected" />;
}
