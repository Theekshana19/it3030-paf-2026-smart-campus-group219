/**
 * @param {{ items: { label: string; colorClass: string }[] }} props
 */
export default function TimelineLegend({ items }) {
  return (
    <div className="flex gap-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-sm ${item.colorClass}`} />
          <span className="text-xs font-medium text-on-surface-variant">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

