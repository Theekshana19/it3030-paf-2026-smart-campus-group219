import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { getTagOverview, listTags } from '../api/tagService.js';

export default function useTagManagement() {
  const [overview, setOverview] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [o, t] = await Promise.all([getTagOverview(), listTags()]);
      setOverview(o);
      setTags(Array.isArray(t) ? t : []);
    } catch (e) {
      const msg = getErrorMessage(e);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { overview, tags, loading, error, load, setTags, setOverview };
}
