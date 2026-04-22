import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { getDashboard } from '../api/dashboardService.js';

export default function useDashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [recentChanges, setRecentChanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboard();
      setOverview(data?.overview ?? null);
      setDistribution(Array.isArray(data?.distribution) ? data.distribution : []);
      setRecentChanges(Array.isArray(data?.recentChanges) ? data.recentChanges : []);
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    overview,
    distribution,
    recentChanges,
    loading,
    error,
    retry: load,
  };
}
