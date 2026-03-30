import { Link } from 'react-router-dom';
import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ onExport: () => void; exportDisabled?: boolean }} props
 */
export default function ResourceListHeader({ onExport, exportDisabled = false }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2 font-label">
          Inventory &amp; Spaces
        </p>
        <h1 className="text-3xl md:text-[2.125rem] font-extrabold font-headline text-on-surface tracking-tight leading-[1.15]">
          All Campus Resources
        </h1>
        <p className="text-on-surface-variant font-body mt-2 text-sm md:text-base max-w-2xl leading-relaxed">
          Browse, filter, and manage bookable facilities across campus. Data is loaded from the live catalogue API.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onExport}
          disabled={exportDisabled}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline-variant font-semibold text-secondary text-sm hover:bg-surface-container-low transition-all disabled:opacity-45"
        >
          <Icon name="download" className="text-lg" />
          Export list
        </button>
        <Link
          to="/resources/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:scale-[0.98] transition-transform"
        >
          <Icon name="add" className="text-lg" />
          New resource
        </Link>
      </div>
    </div>
  );
}
