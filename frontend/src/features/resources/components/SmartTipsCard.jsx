import Icon from '../../../components/common/Icon.jsx';

export default function SmartTipsCard() {
  return (
    <div className="bg-surface-container rounded-2xl p-6 md:p-7 border border-outline-variant/20 shadow-md">
      <h5 className="font-headline font-bold text-sm mb-4 flex items-center gap-2 text-on-surface tracking-tight">
        <Icon name="tips_and_updates" className="text-primary text-lg" />
        Smart Registration Tips
      </h5>
      <ul className="text-xs space-y-3 text-on-surface-variant font-body leading-relaxed">
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">•</span>
          <span>
            Unique <strong className="text-on-surface">Resource Codes</strong> ensure seamless integration with
            scheduling APIs.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">•</span>
          <span>
            Accurate <strong className="text-on-surface">Capacity</strong> limits prevent overbooking violations in
            campus security logs.
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-primary font-bold shrink-0">•</span>
          <span>
            Adding relevant <strong className="text-on-surface">Tags</strong> helps students find the facility via the
            mobile explore app.
          </span>
        </li>
      </ul>
    </div>
  );
}
