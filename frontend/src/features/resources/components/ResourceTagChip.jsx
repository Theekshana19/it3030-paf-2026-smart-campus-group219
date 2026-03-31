import Icon from '../../../components/common/Icon.jsx';
import { findFeatureByTagName } from '../constants/featureTags.js';

/**
 * @param {{ label: string; className?: string }} props
 */
export default function ResourceTagChip({ label, className = '' }) {
  const feature = findFeatureByTagName(label);

  return (
    <span
      className={`inline-flex items-center gap-1 max-w-[10rem] truncate px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight bg-surface-container text-secondary border border-outline-variant/15 ${className}`.trim()}
      title={label}
    >
      {feature ? <Icon name={feature.icon} className="text-[12px] leading-none" /> : null}
      {label}
    </span>
  );
}
