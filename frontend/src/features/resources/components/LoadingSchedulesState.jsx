export default function LoadingSchedulesState() {
  return (
    <div className="p-5 space-y-4 animate-pulse">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="rounded-lg border border-outline-variant/20 p-4 space-y-2">
          <div className="h-5 w-24 bg-surface-container-high rounded-full" />
          <div className="h-4 w-3/4 bg-surface-container-high rounded" />
          <div className="h-3 w-2/3 bg-surface-container-high rounded" />
        </div>
      ))}
    </div>
  );
}

