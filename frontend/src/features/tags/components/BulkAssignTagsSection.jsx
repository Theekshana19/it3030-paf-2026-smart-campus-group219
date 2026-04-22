import { useState } from 'react';
import { toast } from 'sonner';
import Icon from '../../../components/common/Icon.jsx';
import { getErrorMessage } from '../../../services/httpClient.js';
import { bulkAssignTags } from '../api/tagService.js';
import ResourceMultiSelectPanel from './ResourceMultiSelectPanel.jsx';
import TagChipSelectorPanel from './TagChipSelectorPanel.jsx';

/**
 * @param {{
 *   tags: any[];
 *   resourceMode: 'all' | 'untagged';
 *   onResourceModeChange: (mode: 'all' | 'untagged') => void;
 *   onApplied?: () => Promise<void> | void;
 * }} props
 */
export default function BulkAssignTagsSection({ tags, resourceMode, onResourceModeChange, onApplied }) {
  const [resourceIds, setResourceIds] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async () => {
    if (!resourceIds.length || !tagIds.length) {
      toast.message('Select at least one resource and one tag.');
      return;
    }
    setSubmitting(true);
    try {
      const data = await bulkAssignTags({ resourceIds, tagIds });
      const created = data?.mappingsCreated ?? 0;
      const skipped = data?.duplicatesSkipped ?? 0;
      toast.success(`Applied: ${created} new mapping(s)${skipped ? `, ${skipped} already linked` : ''}.`);
      setResourceIds([]);
      setTagIds([]);
      await onApplied?.();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-xl border border-outline-variant/12 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] overflow-hidden">
      <div className="px-6 py-5 border-b border-surface-container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl font-extrabold text-on-surface tracking-tight">Bulk Assign Tags</h2>
          <p className="text-sm text-on-surface-variant font-body mt-1">
            Link multiple tags to multiple resources in one action. Resource catalogue tags update immediately after apply.
          </p>
        </div>
        <div className="flex rounded-lg bg-surface-container-low p-1 gap-1">
          <button
            type="button"
            disabled={submitting}
            onClick={() => onResourceModeChange('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-manrope transition-colors ${
              resourceMode === 'all' ? 'bg-white shadow text-primary' : 'text-on-surface-variant'
            }`}
          >
            All resources
          </button>
          <button
            type="button"
            disabled={submitting}
            onClick={() => onResourceModeChange('untagged')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold font-manrope transition-colors ${
              resourceMode === 'untagged' ? 'bg-white shadow text-primary' : 'text-on-surface-variant'
            }`}
          >
            Untagged only
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:divide-x divide-surface-container">
        <div className="p-6">
          <ResourceMultiSelectPanel
            mode={resourceMode}
            value={resourceIds}
            onChange={setResourceIds}
            disabled={submitting}
          />
        </div>
        <div className="p-6 space-y-6">
          <TagChipSelectorPanel tags={tags} selectedIds={tagIds} onChange={setTagIds} disabled={submitting} />
          <div className="rounded-lg bg-surface-container-low/60 px-4 py-3 text-xs text-on-surface-variant font-body">
            <strong className="text-on-surface">{resourceIds.length}</strong> resource
            {resourceIds.length === 1 ? '' : 's'} selected · <strong className="text-on-surface">{tagIds.length}</strong>{' '}
            tag{tagIds.length === 1 ? '' : 's'} selected
          </div>
          <button
            type="button"
            disabled={submitting || !resourceIds.length || !tagIds.length}
            onClick={handleApply}
            className="w-full py-3 rounded-xl bg-primary text-white font-headline font-bold text-sm shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Icon name={submitting ? 'hourglass_top' : 'link'} className="text-base" />
            {submitting ? 'Applying…' : 'Apply changes'}
          </button>
        </div>
      </div>
    </section>
  );
}
