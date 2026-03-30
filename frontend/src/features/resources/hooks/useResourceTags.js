import { useCallback, useEffect, useState } from 'react';
import * as tagsApi from '../api/tagsApi.js';

export function useResourceTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tagsApi.listTags();
      setTags(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e);
      setTags([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const findByName = useCallback(
    (name) => {
      const n = name.trim().toLowerCase();
      return tags.find((t) => t.tagName?.toLowerCase() === n);
    },
    [tags]
  );

  /**
   * Resolve existing tag or create new one; returns { tagId, tagName }
   */
  const ensureTag = useCallback(
    async (name) => {
      const trimmed = name.trim();
      if (!trimmed) return null;
      const existing = findByName(trimmed);
      if (existing) {
        return { tagId: existing.tagId, tagName: existing.tagName };
      }
      const created = await tagsApi.createTag({
        tagName: trimmed,
        tagColor: undefined,
        description: undefined,
        isActive: true,
      });
      const row = {
        tagId: created.tagId,
        tagName: created.tagName ?? trimmed,
      };
      setTags((prev) => [...prev, row]);
      return row;
    },
    [findByName]
  );

  return { tags, loading, error, refresh, findByName, ensureTag };
}
