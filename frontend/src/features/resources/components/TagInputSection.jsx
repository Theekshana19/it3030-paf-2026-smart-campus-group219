import { useCallback, useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   selected: { tagId: number; tagName: string }[];
 *   onAdd: (tag: { tagId: number; tagName: string }) => void;
 *   onRemove: (tagId: number) => void;
 *   onCreateTag: (name: string) => Promise<{ tagId: number; tagName: string } | null>;
 * }} props
 */
export default function TagInputSection({ selected, onAdd, onRemove, onCreateTag }) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = useCallback(async () => {
    const name = input.trim();
    if (!name) return;
    setBusy(true);
    try {
      const created = await onCreateTag(name);
      if (created) onAdd(created);
      setInput('');
    } finally {
      setBusy(false);
    }
  }, [input, onAdd, onCreateTag]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selected.map((t) => (
          <span
            key={t.tagId}
            className="px-2.5 py-1 bg-surface-container rounded-full text-[10px] font-bold text-secondary uppercase tracking-tight flex items-center gap-1"
          >
            {t.tagName}
            <button
              type="button"
              className="inline-flex"
              onClick={() => onRemove(t.tagId)}
              aria-label={`Remove ${t.tagName}`}
            >
              <Icon name="close" className="text-xs cursor-pointer hover:text-on-surface" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => document.getElementById('tag-input-field')?.focus()}
          className="px-2.5 py-1 bg-primary/10 rounded-full text-[10px] font-bold text-primary uppercase tracking-tight"
        >
          + ADD TAG
        </button>
      </div>
      <input
        id="tag-input-field"
        className="w-full bg-surface-container-low border-none rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none"
        placeholder="Type and hit enter..."
        type="text"
        value={input}
        disabled={busy}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submit();
          }
        }}
      />
    </div>
  );
}
