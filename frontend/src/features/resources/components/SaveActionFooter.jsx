import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *   onDiscard: () => void;
 *   onSave: () => void;
 *   saving?: boolean;
 * }} props
 */
export default function SaveActionFooter({ onDiscard, onSave, saving = false }) {
  return (
    <div className="flex items-center justify-end gap-4 pt-4 pb-12">
      <button
        type="button"
        onClick={onDiscard}
        disabled={saving}
        className="px-6 py-3 text-secondary font-bold hover:bg-surface-container-high rounded-xl transition-all disabled:opacity-50"
      >
        Discard Changes
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="px-8 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:shadow-primary/20 transform hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
      >
        <Icon name="save" className="text-sm" />
        Save &amp; Update Resource
      </button>
    </div>
  );
}

