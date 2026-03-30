/**
 * @param {{ label: string; className?: string }} props
 */
export default function ResourceTagChip({ label, className = '' }) {
  return (
    <span
      className={`inline-flex max-w-[7rem] truncate px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight bg-surface-container text-secondary border border-outline-variant/15 ${className}`.trim()}
      title={label}
    >
      {label}
    </span>
  );
}
