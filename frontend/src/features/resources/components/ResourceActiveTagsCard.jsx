import Icon from '../../../components/common/Icon.jsx';
import ResourceTagChip from './ResourceTagChip.jsx';

/**
 * @param {{ tags: {tagId:number;tagName:string;}[] }} props
 */
export default function ResourceActiveTagsCard({ tags }) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-headline text-lg font-bold text-on-surface">Active Tags</h3>
        <button className="text-primary hover:bg-primary/10 p-1 rounded transition-all" type="button">
          <Icon name="add" className="text-lg" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(tags || []).length ? (
          tags.map((t) => <ResourceTagChip key={t.tagId} label={t.tagName} className="rounded-lg px-3 py-1.5 normal-case tracking-normal text-xs" />)
        ) : (
          <p className="text-sm text-on-surface-variant">No tags assigned.</p>
        )}
      </div>
    </section>
  );
}

