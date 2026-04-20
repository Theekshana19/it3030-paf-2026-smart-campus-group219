function SkeletonRow() {
  return (
    <tr className="border-b border-surface-container-high/60">
      {[140, 180, 100, 110, 160, 90, 60].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 bg-surface-container-high rounded-full animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

export default function LoadingBookingsState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
