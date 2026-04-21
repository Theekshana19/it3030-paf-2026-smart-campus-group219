import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ onCreate?: () => void; onExport?: () => void }} props
 */
export default function SchedulingOverviewHeader({ onCreate, onExport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-extrabold font-manrope text-on-surface tracking-tight">Status Scheduling</h1>
        <p className="text-secondary mt-2 text-lg font-body leading-relaxed">
          Monitor and manage all resource status changes, maintenance windows, and operational overrides across campus.
        </p>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCreate}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/20 hover:bg-primary-container transition-all active:scale-95"
        >
          <Icon name="add" className="text-xl" />
          Create Schedule
        </button>
        <button
          type="button"
          onClick={onExport}
          className="flex items-center gap-2 px-6 py-3 bg-surface-container-lowest text-primary rounded-lg font-semibold shadow-sm border border-outline-variant/30 hover:bg-surface-container transition-all active:scale-95"
        >
          <Icon name="download" className="text-xl" />
          Export Schedule List
        </button>
      </div>
    </div>
  );
}
