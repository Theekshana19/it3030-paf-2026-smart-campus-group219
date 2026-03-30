import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   onCancel: () => void;
 *   onSaveAndAnother: () => void;
 *   loading?: boolean;
 * }} props
 */
export default function PageActionButtons({ onCancel, onSaveAndAnother, loading = false }) {
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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3.5 py-6 mt-3 border-t border-outline-variant/20">
        <button
          type="button"
          onClick={onSaveAndAnother}
          disabled={loading}
          className="px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all disabled:opacity-50"
        >
          Save &amp; Add Another
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-tertiary text-on-tertiary font-bold text-sm shadow-xl shadow-tertiary/10 hover:scale-[0.98] transition-all disabled:opacity-50"
        >
          Finalize &amp; Register
        </button>
      </div>
    </>
  );
}
