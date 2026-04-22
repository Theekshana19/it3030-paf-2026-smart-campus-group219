/**
 * @param {{ count?: number }} props
 */
export default function TagUsageBadge({ count = 0 }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[11px] font-bold tabular-nums">
      {count} {count === 1 ? 'use' : 'uses'}
    </span>
  );
}
