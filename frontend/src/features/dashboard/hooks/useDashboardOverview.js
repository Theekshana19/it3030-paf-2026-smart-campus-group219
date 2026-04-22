import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { getDashboard, getRecentChanges } from '../api/dashboardService.js';

export default function useDashboardOverview() {
  const [overview, setOverview] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [recentChanges, setRecentChanges] = useState([]);
  const [recentPage, setRecentPage] = useState(0);
  const [recentSize] = useState(5);
  const [recentTotalPages, setRecentTotalPages] = useState(0);
  const [recentTotalItems, setRecentTotalItems] = useState(0);
  const [recentLoading, setRecentLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecentChanges = useCallback(
    async (page = 0) => {
      setRecentLoading(true);
      try {
        const data = await getRecentChanges({ page, size: recentSize });
        setRecentChanges(Array.isArray(data?.items) ? data.items : []);
        setRecentPage(Number.isInteger(data?.page) ? data.page : page);
        setRecentTotalPages(Number.isInteger(data?.totalPages) ? data.totalPages : 0);
        setRecentTotalItems(Number.isInteger(data?.totalItems) ? data.totalItems : 0);
      } catch (e) {
        const msg = getErrorMessage(e);
        setError(msg);
        toast.error(msg);
      } finally {
        setRecentLoading(false);
      }
    },
    [recentSize]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getDashboard();
      setOverview(data?.overview ?? null);
      setDistribution(Array.isArray(data?.distribution) ? data.distribution : []);
      await loadRecentChanges(0);
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [loadRecentChanges]);

  return {
    overview,
    distribution,
    recentChanges,
    recentPage,
    recentSize,
    recentTotalPages,
    recentTotalItems,
    recentLoading,
    loading,
    error,
    loadRecentChanges,
    retry: load,
  };
}
