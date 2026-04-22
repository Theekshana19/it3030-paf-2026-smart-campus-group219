import Icon from '../../../components/common/Icon.jsx';

export default function DashboardHeader({ onFilter, onNewResource }) {
  return (
    <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
      <div>
        <p className="text-xs font-bold tracking-[0.08em] text-secondary mb-1 uppercase">Operations Management</p>
        <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface tracking-tight">
          Facilities &amp; Assets Catalogue
        </h1>
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onFilter}
          className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-lowest text-on-surface font-semibold rounded-xl shadow-[0_4px_12px_rgba(23,28,31,0.05)] hover:bg-surface-container transition-all"
        >
          <Icon name="filter_list" className="text-lg" />
          Filter
        </button>
        <button
          type="button"
          onClick={onNewResource}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-primary to-primary-container text-on-primary font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Icon name="add" className="text-lg" />
          New Resource
        </button>
      </div>
    </section>
  );
}
