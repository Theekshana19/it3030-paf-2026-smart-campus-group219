import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '../../../components/common/Icon.jsx';
import { getErrorMessage } from '../../../services/httpClient.js';
import { createTag } from '../api/tagService.js';
import ColorCategoryPicker from './ColorCategoryPicker.jsx';
import { TAG_COLOR_PRESETS } from '../constants/tagColorPresets.js';

/**
 * @param {{ onCreated?: () => Promise<void> | void; disabled?: boolean }} props
 */
export default function CreateTagPanel({ onCreated, disabled }) {
  const [tagName, setTagName] = useState('');
  const [description, setDescription] = useState('');
  const [tagColor, setTagColor] = useState(TAG_COLOR_PRESETS[0].value);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = tagName.trim();
    if (!name) {
      toast.error('Tag name is required.');
      return;
    }
    if (name.length > 80) {
      toast.error('Tag name must be 80 characters or less.');
      return;
    }
    setSubmitting(true);
    try {
      await createTag({ tagName: name, description: description.trim(), tagColor, isActive: true });
      toast.success('Tag created successfully.');
      setTagName('');
      setDescription('');
      setTagColor(TAG_COLOR_PRESETS[0].value);
      await onCreated?.();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Icon name="add_circle" className="text-primary text-lg" />
        <h3 className="font-headline text-base font-bold text-on-surface">Create New Tag</h3>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Tag name</label>
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            disabled={disabled || submitting}
            maxLength={80}
            placeholder="e.g. High-Capacity Lab"
            className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm font-body focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-on-surface-variant mb-1.5 ml-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={disabled || submitting}
            maxLength={300}
            rows={3}
            placeholder="Optional context for staff…"
            className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg text-sm font-body focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
        <ColorCategoryPicker value={tagColor} onChange={setTagColor} disabled={disabled || submitting} />
        <button
          type="submit"
          disabled={disabled || submitting}
          className="w-full py-3 rounded-xl bg-primary text-white font-headline font-bold text-sm shadow-lg hover:opacity-95 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
        >
          <Icon name={submitting ? 'hourglass_top' : 'verified'} className="text-base" />
          {submitting ? 'Creating…' : 'Create tag'}
        </button>
      </form>
    </section>
  );
}
