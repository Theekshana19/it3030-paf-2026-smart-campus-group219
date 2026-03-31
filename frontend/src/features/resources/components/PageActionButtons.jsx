import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   onCancel: () => void;
 *   loading?: boolean;
 * }} props
 */
export default function PageActionButtons({ onCancel, loading = false }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div />
        <div className="flex items-center gap-3 justify-end flex-wrap">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border border-outline-variant font-semibold text-secondary text-sm hover:bg-surface-container-low transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Icon name="save" className="text-lg" />
            Save Resource
          </button>
        </div>
      </div>
      {/* Secondary row removed to keep a single primary save action */}
    </>
  );
}
