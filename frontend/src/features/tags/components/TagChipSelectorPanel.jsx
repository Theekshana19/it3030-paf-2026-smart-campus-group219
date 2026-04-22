import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   tags: { tagId: number; tagName: string; tagColor?: string }[];
 *   selectedIds: number[];
 *   onChange: (ids: number[]) => void;
 *   disabled?: boolean;
 * }} props
 */
export default function TagChipSelectorPanel({ tags = [], selectedIds = [], onChange, disabled }) {
  const set = new Set(selectedIds);

  const toggle = (tagId) => {
    if (disabled) return;
    const id = Number(tagId);
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon name="sell" className="text-primary text-sm" />
        <h4 className="text-[0.6875rem] font-bold text-on-surface-variant uppercase tracking-[0.05em]">
          Tags to apply
        </h4>
      </div>
      {!tags.length ? (
        <p className="text-xs text-on-surface-variant">Create tags first to enable bulk assignment.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => {
            const active = set.has(Number(t.tagId));
            const bg = t.tagColor || '#64748B';
            return (
              <button
                key={t.tagId}
                type="button"
                disabled={disabled}
                onClick={() => toggle(t.tagId)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-manrope border-2 transition-all ${
                  active ? 'text-white shadow-md scale-[1.02]' : 'bg-white text-on-surface border-surface-container'
                }`}
                style={
                  active
                    ? { backgroundColor: bg, borderColor: bg }
                    : { borderColor: 'transparent', boxShadow: `inset 0 0 0 1px ${bg}55` }
                }
              >
                {t.tagName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
