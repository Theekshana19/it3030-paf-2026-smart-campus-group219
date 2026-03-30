/**
 * @param {{ rows?: number }} props
 */
export default function LoadingResourcesState({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-outline-variant/5 animate-pulse">
          <td className="py-4 px-4">
            <div className="h-4 bg-surface-container rounded w-40 mb-2" />
            <div className="h-3 bg-surface-container rounded w-24" />
          </td>
          <td className="py-4 px-3">
            <div className="h-4 bg-surface-container rounded w-20" />
          </td>
          <td className="py-4 px-3">
            <div className="h-4 bg-surface-container rounded w-8" />
          </td>
          <td className="py-4 px-3">
            <div className="h-4 bg-surface-container rounded w-36" />
          </td>
          <td className="py-4 px-3">
            <div className="h-4 bg-surface-container rounded w-28" />
          </td>
          <td className="py-4 px-3">
            <div className="flex gap-1">
              <div className="h-5 bg-surface-container rounded-full w-14" />
              <div className="h-5 bg-surface-container rounded-full w-16" />
            </div>
          </td>
          <td className="py-4 px-3 text-right">
            <div className="h-8 bg-surface-container rounded-lg w-24 ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
}
