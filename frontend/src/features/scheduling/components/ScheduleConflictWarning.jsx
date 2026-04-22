import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ conflict: {hasConflict:boolean; conflictWith?: {reasonNote?:string; startTime?:string; endTime?:string}} | null }} props
 */
export default function ScheduleConflictWarning({ conflict }) {
  if (!conflict?.hasConflict) return null;
  const details = conflict.conflictWith;
  const note = details?.reasonNote || 'Existing schedule detected in selected window.';
  return (
    <section className="p-4 bg-error-container/20 rounded-xl border border-error/10 flex gap-4">
      <Icon name="warning" className="text-error mt-0.5" />
      <div>
        <h4 className="text-sm font-bold text-on-error-container">Overlap Warning</h4>
        <p className="text-xs text-on-error-container/80 mt-1">
          {note}
          {details?.startTime && details?.endTime ? ` (${details.startTime} - ${details.endTime})` : ''}
        </p>
      </div>
    </section>
  );
}
