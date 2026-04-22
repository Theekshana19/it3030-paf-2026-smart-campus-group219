import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert } from '../../../utils/sweetAlerts.js';
import { deleteTag } from '../api/tagService.js';
import BulkAssignTagsSection from '../components/BulkAssignTagsSection.jsx';
import CreateTagPanel from '../components/CreateTagPanel.jsx';
import EditTagModal from '../components/EditTagModal.jsx';
import ExistingTagsSection from '../components/ExistingTagsSection.jsx';
import MostUsedTagsCard from '../components/MostUsedTagsCard.jsx';
import NeedsAttentionCard from '../components/NeedsAttentionCard.jsx';
import useTagManagement from '../hooks/useTagManagement.js';

export default function TagManagementPage() {
  const { overview, tags, loading, error, load } = useTagManagement();
  const [bulkResourceMode, setBulkResourceMode] = useState('all');
  const [editingTag, setEditingTag] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(async () => {
    await load();
  }, [load]);

  const handleDeleteTag = useCallback(
    async (tag) => {
      const ok = await confirmDeleteAlert({
        title: 'Delete this tag?',
        text: `This removes "${tag.tagName}" and all resource links to it.`,
        confirmText: 'Delete',
      });
      if (!ok) return;
      try {
        await deleteTag(tag.tagId);
        toast.success('Tag deleted.');
        await refresh();
      } catch (e) {
        toast.error(getErrorMessage(e));
      }
    },
    [refresh]
  );

  const handleEditTag = useCallback((tag) => {
    setEditingTag(tag);
    setEditOpen(true);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <div>
        <nav className="flex text-xs font-bold tracking-widest text-on-surface-variant mb-2 uppercase">
          <span className="text-primary">Tag Management</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface tracking-tight">Campus Tag Manager</h1>
        <p className="text-on-surface-variant text-sm mt-2 max-w-2xl font-body leading-relaxed">
          Create labels, review adoption, and bulk-link tags to facilities across the campus catalogue.
        </p>
      </div>

      {error ? (
        <div className="rounded-xl bg-error-container text-on-error-container px-6 py-4 flex items-center justify-between gap-4">
          <span className="font-medium text-sm">{error}</span>
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-error text-on-error text-sm font-semibold shrink-0"
            onClick={() => load()}
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-4 space-y-6">
          <MostUsedTagsCard items={overview?.mostUsedTags} loading={loading} />
          <NeedsAttentionCard
            untaggedCount={overview?.untaggedResourceCount}
            loading={loading}
            onViewResources={() => setBulkResourceMode('untagged')}
          />
          <CreateTagPanel onCreated={refresh} disabled={loading} />
        </div>
        <div className="xl:col-span-8">
          <ExistingTagsSection
            tags={tags}
            loading={loading}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
          />
        </div>
      </div>

      <BulkAssignTagsSection
        tags={tags}
        resourceMode={bulkResourceMode}
        onResourceModeChange={setBulkResourceMode}
        onApplied={refresh}
      />

      <EditTagModal
        tag={editingTag}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setEditingTag(null);
        }}
        onSaved={refresh}
      />
    </div>
  );
}
