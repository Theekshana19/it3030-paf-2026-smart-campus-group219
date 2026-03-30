import { Link, useParams } from 'react-router-dom';

export default function ResourceSchedulesPlaceholderPage() {
  const { resourceId } = useParams();

  return (
    <div className="p-8 md:p-10 max-w-3xl mx-auto">
      <p className="text-xs font-bold uppercase tracking-wider text-primary font-label mb-2">Scheduling</p>
      <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">
        Status schedules
      </h2>
      <p className="text-on-surface-variant mt-3 font-body text-sm md:text-base leading-relaxed">
        Schedule management for resource <span className="font-mono font-semibold text-on-surface">{resourceId}</span>{' '}
        is coming soon.
      </p>
      <div className="flex gap-4 mt-6">
        <Link to={`/resources/${resourceId}`} className="text-sm font-bold text-primary hover:underline">
          Resource details
        </Link>
        <Link to="/resources" className="text-sm font-bold text-secondary hover:underline">
          Catalogue
        </Link>
      </div>
    </div>
  );
}
