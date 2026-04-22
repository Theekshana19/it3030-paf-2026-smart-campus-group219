import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';
import { listDrawerResources } from '../api/schedulingService.js';

/**
 * @param {{ value: number[]; onChange: (ids: number[]) => void; errorMessage?: string; disabled?: boolean }} props
 */
export default function MultiResourceSelector({ value = [], onChange, errorMessage, disabled }) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lookup, setLookup] = useState({});
  const selectAllRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const list = await listDrawerResources(query);
        if (cancelled) return;
        setOptions(Array.isArray(list) ? list : []);
        setLookup((prev) => {
          const next = { ...prev };
          (Array.isArray(list) ? list : []).forEach((r) => {
            next[r.resourceId] = r;
          });
          return next;
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const selectedSet = useMemo(() => new Set(value || []), [value]);

  const optionIds = useMemo(() => options.map((r) => Number(r.resourceId)), [options]);

  const { allVisibleSelected, someVisibleSelected } = useMemo(() => {
    if (!optionIds.length) return { allVisibleSelected: false, someVisibleSelected: false };
    const every = optionIds.every((id) => selectedSet.has(id));
    const some = optionIds.some((id) => selectedSet.has(id));
    return {
      allVisibleSelected: every,
      someVisibleSelected: some && !every,
    };
  }, [optionIds, selectedSet]);

  useEffect(() => {
    const el = selectAllRef.current;
    if (el) el.indeterminate = someVisibleSelected;
  }, [someVisibleSelected]);

  const toggle = useCallback(
    (resource) => {
      if (disabled) return;
      const id = Number(resource.resourceId);
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

  const toggleSelectAllVisible = useCallback(() => {
    if (disabled || !optionIds.length) return;
    if (allVisibleSelected) {
      const drop = new Set(optionIds);
      onChange((value || []).filter((id) => !drop.has(Number(id))));
      return;
    }
    onChange([...new Set([...(value || []), ...optionIds])]);
  }, [disabled, optionIds, allVisibleSelected, value, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon name="category" className="text-primary text-sm" />
        <label className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
          Resources
        </label>
      </div>
      <div className="relative">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
          placeholder="Search by name, code, or building..."
          className="w-full pl-10 pr-4 py-3 bg-surface-container-low border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
        />
      </div>
      {errorMessage ? <p className="text-xs text-error ml-1">{errorMessage}</p> : null}

      {value?.length ? (
        <div className="flex flex-wrap gap-2">
          {value.map((id) => {
            const r = lookup[id];
            const label = r?.resourceName || `Resource #${id}`;
            const sub = [r?.resourceCode, r?.building].filter(Boolean).join(' · ');
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 pl-3 pr-1 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/15"
              >
                <span className="max-w-[200px] truncate" title={sub ? `${label} (${sub})` : label}>
                  {label}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeId(id)}
                  className="p-1 rounded-full hover:bg-primary/20 disabled:opacity-50"
                  aria-label={`Remove ${label}`}
                >
                  <Icon name="close" className="text-sm" />
                </button>
              </span>
            );
          })}
        </div>
      ) : null}

      <div className="max-h-52 overflow-y-auto rounded-xl border border-surface-container bg-surface-container-low/40 divide-y divide-surface-container">
        {loading ? (
          <div className="p-4 text-xs text-on-surface-variant flex items-center gap-2">
            <Icon name="hourglass_top" className="text-base" />
            Loading resources…
          </div>
        ) : null}
        {!loading && !options.length ? (
          <div className="p-4 text-xs text-on-surface-variant">No resources match this search.</div>
        ) : null}
        {!loading && options.length > 0 ? (
          <div className="sticky top-0 z-[1] flex items-center gap-3 px-3 py-2.5 bg-surface-container-low/95 backdrop-blur-sm border-b border-surface-container">
            <input
              ref={selectAllRef}
              type="checkbox"
              id="multi-resource-select-all"
              disabled={disabled}
              checked={allVisibleSelected}
              onChange={toggleSelectAllVisible}
              className="rounded border-surface-container text-primary focus:ring-primary"
            />
            <label htmlFor="multi-resource-select-all" className="text-xs font-semibold text-on-surface cursor-pointer select-none flex-1">
              Select all in this list
              <span className="block font-normal text-on-surface-variant mt-0.5">
                {options.length} resource{options.length === 1 ? '' : 's'} (current search; max 100)
              </span>
            </label>
          </div>
        ) : null}
        {!loading
          ? options.map((resource) => {
              const id = Number(resource.resourceId);
              const checked = selectedSet.has(id);
              return (
                <label
                  key={id}
                  className="flex items-start gap-3 p-3 cursor-pointer hover:bg-white/60 text-sm"
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-surface-container text-primary focus:ring-primary"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(resource)}
                  />
                  <span className="flex-1 min-w-0">
                    <span className="font-semibold text-on-surface block truncate">{resource.resourceName}</span>
                    <span className="text-xs text-on-surface-variant block truncate">
                      {[resource.resourceCode, resource.building].filter(Boolean).join(' · ') || 'Campus resource'}
                    </span>
                  </span>
                </label>
              );
            })
          : null}
      </div>
    </div>
  );
}
