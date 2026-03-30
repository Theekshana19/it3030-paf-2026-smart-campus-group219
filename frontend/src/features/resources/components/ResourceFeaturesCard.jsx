import { useMemo, useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';
import TagInputSection from './TagInputSection.jsx';

const FEATURE_TILES = [
  { key: 'recording', label: 'Recording', icon: 'videocam' },
  { key: 'fiber_wifi', label: 'Fiber WiFi', icon: 'wifi' },
  { key: 'ada', label: 'ADA Compliant', icon: 'accessible' },
  { key: 'pantry', label: 'Pantry', icon: 'kitchen' },
];

/**
 * Edit card used by the Edit Resource page.
 * Feature tiles are UI-only, but "Add Custom Tag" manages real resource tags.
 *
 * @param {{
 *   selectedTags: { tagId: number; tagName: string }[];
 *   onAddTag: (tag: { tagId: number; tagName: string }) => void;
 *   onRemoveTag: (tagId: number) => void;
 *   onCreateTag: (name: string) => Promise<{ tagId: number; tagName: string } | null>;
 * }} props
 */
export default function ResourceFeaturesCard({
  selectedTags,
  onAddTag,
  onRemoveTag,
  onCreateTag,
}) {
  const [selectedFeatures, setSelectedFeatures] = useState(() => new Set());
  const [tagInputOpen, setTagInputOpen] = useState(false);

  const tiles = useMemo(() => FEATURE_TILES, []);

  const toggleTile = (key) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
            <Icon name="precision_manufacturing" className="text-xl" />
          </div>
          <h3 className="text-lg font-bold font-manrope">Equipment &amp; Features</h3>
        </div>

        <button
          type="button"
          onClick={() => setTagInputOpen((v) => !v)}
          className="text-primary text-sm font-semibold hover:underline"
        >
          Add Custom Tag
        </button>
      </div>

      {tagInputOpen ? (
        <div className="mb-5">
          <TagInputSection
            selected={selectedTags}
            onAdd={onAddTag}
            onRemove={onRemoveTag}
            onCreateTag={onCreateTag}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tiles.map((t) => {
          const on = selectedFeatures.has(t.key);
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggleTile(t.key)}
              className={[
                'p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all',
                on ? 'border-primary/30 bg-primary-fixed' : 'border-primary/10 bg-surface',
              ].join(' ')}
              aria-pressed={on}
            >
              <Icon name={t.icon} className="text-primary text-lg" />
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

