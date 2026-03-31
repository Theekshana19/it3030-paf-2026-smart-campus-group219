import Icon from '../../../components/common/Icon.jsx';

export default function EmptyResourcesState() {
  return (
    <tr>
      <td colSpan={7} className="py-20 px-8 text-center">
        <div className="max-w-2xl mx-auto relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)] px-8 py-14">
          <div className="absolute -top-20 -right-20 w-56 h-56 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-tertiary/5 rounded-full blur-3xl" />

          <div className="relative w-24 h-24 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon name="inventory_2" className="text-6xl text-outline-variant" />
            <span className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md">
              <Icon name="search_off" className="text-error text-xl" />
            </span>
          </div>

          <p className="font-headline font-bold text-xl text-on-surface">No Resources Found</p>
          <p className="text-sm text-on-surface-variant mt-2 font-body leading-relaxed max-w-xl mx-auto">
            We couldn&apos;t find any resources matching your current search or filters. Try adjusting your criteria or
            adding a new resource to the catalogue.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-xl transition-all hover:shadow-[0_32px_32px_-4px_rgba(23,28,31,0.1)] active:scale-95"
            >
              <Icon name="add_circle" className="mr-2" />
              Add Your First Resource
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center px-6 py-3 bg-surface-container-high text-secondary font-semibold rounded-xl transition-all hover:bg-surface-container-highest active:scale-95"
            >
              <Icon name="close" className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
