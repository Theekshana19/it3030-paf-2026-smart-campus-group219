import Icon from '../../../components/common/Icon.jsx';
import TagUsageBadge from './TagUsageBadge.jsx';

/**
 * @param {{
 *   tag: { tagId: number; tagName: string; tagColor?: string; description?: string; isActive?: boolean; usageCount?: number };
 *   onEdit?: () => void;
 *   onDelete?: () => void;
 * }} props
 */
export default function TagCard({ tag, onEdit, onDelete }) {
  const color = tag.tagColor || '#94A3B8';
  return (
    <article className="bg-white rounded-xl border border-outline-variant/12 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] p-5 flex flex-col gap-3 hover:border-primary/20 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} aria-hidden />
          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-md shrink-0">
            {tag.isActive === false ? 'Inactive' : 'Active'}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            aria-label={`Edit ${tag.tagName}`}
          >
            <Icon name="edit" className="text-lg" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-error-container/30 text-on-surface-variant hover:text-error transition-colors"
            aria-label={`Delete ${tag.tagName}`}
          >
            <Icon name="delete" className="text-lg" />
          </button>
        </div>
      </div>
      <h4 className="font-headline font-bold text-on-surface text-lg leading-tight truncate">{tag.tagName}</h4>
      <p className="text-sm text-on-surface-variant font-body line-clamp-2 min-h-[2.5rem]">
        {tag.description?.trim() || 'No description provided.'}
      </p>
      <div className="mt-auto pt-2 flex items-center justify-between border-t border-surface-container">
        <TagUsageBadge count={tag.usageCount ?? 0} />
      </div>
    </article>
  );
}
