import Icon from '../../../components/common/Icon.jsx';

// this component is shown when no tickets match the current filters
export default function EmptyTicketsState() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-12 text-center">
      <Icon name="confirmation_number" className="text-5xl text-on-surface-variant/40 mb-4" />
      <h3 className="text-lg font-bold font-manrope text-on-surface mb-1">No tickets found</h3>
      <p className="text-sm text-on-surface-variant font-body">
        Try adjusting your filters or report a new issue.
      </p>
    </div>
  );
}
