import ResourceDistributionCard from './ResourceDistributionCard.jsx';

export default function ResourceDistributionSection({ distribution, loading }) {
  const maxCount = Math.max(...distribution.map((d) => Number(d.count || 0)), 0);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.06)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-headline font-bold">Resource Distribution</h2>
        <button type="button" className="text-sm font-semibold text-primary hover:underline">
          View Analytics
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {distribution.map((item) => (
          <ResourceDistributionCard
            key={item.resourceType}
            item={item}
            maxCount={maxCount}
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}
