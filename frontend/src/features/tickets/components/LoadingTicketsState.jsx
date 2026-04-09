// this loading skeleton is displayed while the ticket data is being fetched
export default function LoadingTicketsState() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-4 bg-surface-container-high rounded w-16" />
          <div className="h-4 bg-surface-container-high rounded w-40" />
          <div className="h-4 bg-surface-container-high rounded w-24" />
          <div className="h-6 bg-surface-container-high rounded-full w-16" />
          <div className="h-6 bg-surface-container-high rounded-full w-20" />
          <div className="h-4 bg-surface-container-high rounded w-28" />
        </div>
      ))}
    </div>
  );
}
