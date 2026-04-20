import { useEffect, useState } from 'react';
import * as ticketsApi from '../api/ticketsApi.js';
import Icon from '../../../components/common/Icon.jsx';

// this component detects if the current resource has a recurring problem
// it checks how many similar tickets were created in the last 30 days
// if 3 or more found, we display the pattern alert banner
export default function TicketPatternAlert({ ticketId }) {
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (!ticketId) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await ticketsApi.getPatternAlert(ticketId);
        if (!cancelled) setAlert(data);
      } catch {
        if (!cancelled) setAlert(null);
      }
    })();
    return () => { cancelled = true; };
  }, [ticketId]);

  if (!alert || !alert.isRecurring) return null;

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
      <div className="flex items-center gap-2 text-orange-800 mb-2">
        <Icon name="warning" className="text-xl" />
        <h4 className="font-bold font-manrope text-sm">Recurring Issue Detected</h4>
      </div>
      <div className="text-sm text-orange-700 font-body space-y-1">
        <p>
          <span className="font-medium">Resource:</span> {alert.resourceName}
        </p>
        <p>
          <span className="font-medium">Category:</span> {alert.category?.replace('_', ' ')}
        </p>
        <p>
          <span className="font-medium">Similar tickets in last 30 days:</span> {alert.ticketCount}
        </p>
        {alert.recommendation && (
          <p className="mt-2 font-medium">{alert.recommendation}</p>
        )}
      </div>
    </div>
  );
}
