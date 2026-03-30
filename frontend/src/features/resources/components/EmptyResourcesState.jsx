import Icon from '../../../components/common/Icon.jsx';

export default function EmptyResourcesState() {
  return (
    <tr>
      <td colSpan={7} className="py-16 px-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-4">
            <Icon name="inventory_2" className="text-3xl text-on-surface-variant" />
          </div>
          <p className="font-headline font-bold text-lg text-on-surface">No resources match</p>
          <p className="text-sm text-on-surface-variant mt-2 font-body leading-relaxed">
            Try adjusting filters or add a new resource to the catalogue.
          </p>
        </div>
      </td>
    </tr>
  );
}
