import { useMemo, useState } from 'react';
import Icon from '../../../components/common/Icon.jsx';
import TagInputSection from './TagInputSection.jsx';
import {
  FEATURE_TAG_MAP,
  findFeatureByTagName,
  normalizeTagName,
} from '../constants/featureTags.js';

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
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const selectedByName = useMemo(
    () => new Set((selectedTags || []).map((tag) => normalizeTagName(tag.tagName))),
    [selectedTags]
  );
  const tiles = useMemo(() => FEATURE_TAG_MAP, []);

  const toggleTile = async (tile) => {
    const existing = (selectedTags || []).find((tag) => {
      const feature = findFeatureByTagName(tag.tagName);
      return feature?.key === tile.key;
    });

    if (existing) {
      onRemoveTag(existing.tagId);
      return;
    }

    const createdOrFound = await onCreateTag(tile.label);
    if (createdOrFound) onAddTag(createdOrFound);
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
          const on =
            selectedByName.has(normalizeTagName(t.label)) ||
            selectedByName.has(normalizeTagName(t.key));
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => toggleTile(t)}
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

