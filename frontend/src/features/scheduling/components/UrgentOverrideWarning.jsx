import Icon from '../../../components/common/Icon.jsx';

export default function UrgentOverrideWarning() {
  return (
    <section className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex gap-4">
      <Icon name="bolt" className="text-amber-700 text-xl mt-0.5" />
      <div>
        <h4 className="text-sm font-bold text-amber-900">Emergency override</h4>
        <p className="text-xs text-amber-900/85 mt-1 leading-relaxed">
          This action can disrupt bookings and staff workflows. Only continue for verified outages, safety issues, or
          executive-approved incidents. Misuse may be audited against campus operations policy.
        </p>
      </div>
    </section>
  );
}
