import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Icon from '../../../components/common/Icon.jsx';
import { getErrorMessage } from '../../../services/httpClient.js';
import { updateTag } from '../api/tagService.js';
import ColorCategoryPicker from './ColorCategoryPicker.jsx';

/**
 * @param {{ tag: any; open: boolean; onClose: () => void; onSaved: () => Promise<void> | void }} props
 */
export default function EditTagModal({ tag, open, onClose, onSaved }) {
  const [tagName, setTagName] = useState('');
  const [description, setDescription] = useState('');
  const [tagColor, setTagColor] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !tag) return;
    setTagName(tag.tagName || '');
    setDescription(tag.description || '');
    setTagColor(tag.tagColor || '#4F46E5');
    setIsActive(tag.isActive !== false);
  }, [open, tag]);

  if (!open || !tag) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = tagName.trim();
    if (!name) {
      toast.error('Tag name is required.');
      return;
    }
    setSubmitting(true);
    try {
      await updateTag(tag.tagId, {
        tagName: name,
        description: description.trim() || undefined,
        tagColor: tagColor || undefined,
        isActive,
      });
      toast.success('Tag updated.');
      await onSaved?.();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Close modal overlay"
        className="fixed inset-0 bg-on-surface/45 backdrop-blur-[2px] z-[70]"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[80] w-[min(440px,92vw)] bg-white rounded-2xl shadow-2xl border border-outline-variant/15 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-headline text-lg font-bold text-on-surface">Edit tag</h3>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-surface-container">
            <Icon name="close" className="text-on-surface-variant" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Tag name</label>
            <input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              disabled={submitting}
              maxLength={80}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm border-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              maxLength={300}
              rows={3}
              className="w-full px-4 py-2.5 bg-surface-container-low rounded-lg text-sm border-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <ColorCategoryPicker value={tagColor} onChange={setTagColor} disabled={submitting} />
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm font-semibold text-on-surface">Active</span>
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={submitting}
              className="rounded text-primary focus:ring-primary w-5 h-5"
            />
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md disabled:opacity-60"
            >
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
