import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';
import { listResources } from '../../resources/api/resourcesApi.js';
import { listUntaggedResources } from '../api/tagService.js';

/**
 * @param {{
 *   mode: 'all' | 'untagged';
 *   value: number[];
 *   onChange: (ids: number[]) => void;
 *   disabled?: boolean;
 * }} props
 */
export default function ResourceMultiSelectPanel({ mode, value = [], onChange, disabled }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState({});

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        if (mode === 'untagged') {
          const data = await listUntaggedResources({
            search: query || undefined,
            page: 0,
            size: 100,
            sortBy: 'resourceName',
            sortDir: 'asc',
          });
          const items = Array.isArray(data?.items) ? data.items : [];
          if (!cancelled) {
            setOptions(items);
            setLookup((prev) => {
              const next = { ...prev };
              items.forEach((r) => {
                next[r.resourceId] = r;
              });
              return next;
            });
          }
        } else {
          const data = await listResources({
            page: 0,
            size: 100,
            sortBy: 'resourceName',
            sortDir: 'asc',
            search: query || undefined,
          });
          const items = Array.isArray(data?.items) ? data.items : [];
          if (!cancelled) {
            setOptions(items);
            setLookup((prev) => {
              const next = { ...prev };
              items.forEach((r) => {
                next[r.resourceId] = r;
              });
              return next;
            });
          }
        }
      } catch {
        if (!cancelled) setOptions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, mode]);

  const selectedSet = useMemo(() => new Set(value || []), [value]);
  const optionIds = useMemo(() => options.map((r) => Number(r.resourceId)), [options]);
  const allSelected = useMemo(
    () => optionIds.length > 0 && optionIds.every((id) => selectedSet.has(id)),
    [optionIds, selectedSet]
  );
  const someSelected = useMemo(
    () => !allSelected && optionIds.some((id) => selectedSet.has(id)),
    [allSelected, optionIds, selectedSet]
  );

  const toggle = useCallback(
    (row) => {
      if (disabled) return;
      const id = Number(row.resourceId);
      const next = new Set(selectedSet);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      onChange(Array.from(next));
    },
    [disabled, onChange, selectedSet]
  );

  const removeId = useCallback(
    (id) => {
      if (disabled) return;
      onChange((value || []).filter((x) => Number(x) !== Number(id)));
    },
    [disabled, onChange, value]
  );

  const toggleSelectAll = useCallback(() => {
    if (disabled || !optionIds.length) return;
    if (allSelected) {
      const optionIdSet = new Set(optionIds);
      onChange((value || []).filter((id) => !optionIdSet.has(Number(id))));
      return;
    }
    const merged = new Set([...(value || []), ...optionIds]);
    onChange(Array.from(merged));
  }, [allSelected, disabled, onChange, optionIds, value]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon name="inventory_2" className="text-primary text-sm" />
        <h4 className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
          Select resources
        </h4>
      </div>
      <div className="relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder={mode === 'untagged' ? 'Search untagged resources…' : 'Search resources…'}
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-on-surface-variant cursor-pointer select-none">
        <input
          type="checkbox"
          checked={allSelected}
          ref={(el) => {
            if (el) el.indeterminate = someSelected;
          }}
          disabled={disabled || loading || !optionIds.length}
          onChange={toggleSelectAll}
          className="rounded border-surface-container text-primary focus:ring-primary"
        />
        <span>{allSelected ? 'Unselect all resources' : 'Select all resources'}</span>
      </label>
      {value?.length ? (
        <div className="flex flex-wrap gap-2">
          {value.map((id) => {
            const r = lookup[id];
            const label = r?.resourceName || `Resource #${id}`;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15"
              >
                <span className="max-w-[160px] truncate">{label}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeId(id)}
                  className="p-0.5 rounded-full hover:bg-primary/20"
                  aria-label={`Remove ${label}`}
                >
                  <Icon name="close" className="text-sm" />
                </button>
              </span>
            );
          })}
        </div>
      ) : null}
      <div className="max-h-64 overflow-y-auto rounded-xl border border-surface-container bg-surface-container-low/30 divide-y divide-surface-container">
        {loading ? (
          <div className="p-4 text-xs text-on-surface-variant flex items-center gap-2">
            <Icon name="hourglass_top" />
            Loading…
          </div>
        ) : null}
        {!loading && !options.length ? (
          <div className="p-4 text-xs text-on-surface-variant">No resources found.</div>
        ) : null}
        {!loading
          ? options.map((r) => {
              const id = Number(r.resourceId);
              const checked = selectedSet.has(id);
              const sub = [r.resourceCode, r.building].filter(Boolean).join(' · ');
              return (
                <label
                  key={id}
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/70 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-surface-container text-primary focus:ring-primary"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(r)}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="font-semibold text-on-surface block truncate">{r.resourceName}</span>
                    <span className="text-xs text-on-surface-variant block truncate">{sub || 'Campus resource'}</span>
                  </span>
                </label>
              );
            })
          : null}
      </div>
    </div>
  );
}
