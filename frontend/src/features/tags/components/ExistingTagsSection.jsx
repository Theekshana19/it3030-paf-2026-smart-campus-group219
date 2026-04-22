import { useMemo, useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';
import TagCard from './TagCard.jsx';

/**
 * @param {{
 *   tags: any[];
 *   loading?: boolean;
 *   onEditTag: (tag: any) => void;
 *   onDeleteTag: (tag: any) => void;
 * }} props
 */
export default function ExistingTagsSection({ tags = [], loading, onEditTag, onDeleteTag }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name-asc');

  const filteredSorted = useMemo(() => {
    let list = Array.isArray(tags) ? [...tags] : [];
    const q = filter.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          String(t.tagName || '')
            .toLowerCase()
            .includes(q) ||
          String(t.description || '')
            .toLowerCase()
            .includes(q)
      );
    }
    const [key, dir] = sort.split('-');
    list.sort((a, b) => {
      if (key === 'usage') {
        const av = a.usageCount ?? 0;
        const bv = b.usageCount ?? 0;
        return dir === 'asc' ? av - bv : bv - av;
      }
      const an = String(a.tagName || '').toLowerCase();
      const bn = String(b.tagName || '').toLowerCase();
      return dir === 'asc' ? an.localeCompare(bn) : bn.localeCompare(an);
    });
    return list;
  }, [tags, filter, sort]);

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-extrabold text-on-surface tracking-tight">Existing Tags</h2>
          <p className="text-sm text-on-surface-variant font-body mt-1 max-w-xl">
            Manage labels used across the catalogue. Usage counts reflect live resource mappings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex items-center bg-surface-container-low rounded-lg px-3 py-2">
            <Icon name="filter_list" className="text-on-surface-variant mr-2 text-lg" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter tags…"
              className="bg-transparent border-none text-sm w-40 focus:ring-0 outline-none font-body"
            />
          </div>
          <div className="flex items-center gap-1 bg-surface-container-low rounded-lg px-2 py-1">
            <Icon name="sort" className="text-on-surface-variant text-lg ml-1" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent border-none text-sm font-semibold text-on-surface py-1 pr-6 focus:ring-0 cursor-pointer"
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="usage-desc">Most used</option>
              <option value="usage-asc">Least used</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border border-surface-container bg-surface-container-low/40 px-6 py-12 text-center text-on-surface-variant text-sm font-body">
          Loading tags…
        </div>
      ) : !filteredSorted.length ? (
        <div className="rounded-xl border border-dashed border-outline-variant/40 bg-surface-container-lowest px-6 py-12 text-center">
          <Icon name="sell" className="text-4xl text-on-surface-variant/40 mx-auto mb-3" />
          <p className="text-on-surface-variant text-sm font-body">
            {tags.length ? 'No tags match this filter.' : 'No tags yet. Create one using the panel on the left.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredSorted.map((tag) => (
            <TagCard key={tag.tagId} tag={tag} onEdit={() => onEditTag(tag)} onDelete={() => onDeleteTag(tag)} />
          ))}
        </div>
      )}
    </section>
  );
}
