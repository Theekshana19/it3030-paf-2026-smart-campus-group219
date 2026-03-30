import { Link, useParams } from 'react-router-dom';

export default function ResourceDetailPlaceholderPage() {
  const { resourceId } = useParams();

  return (
    <div className="p-8 md:p-10 max-w-3xl mx-auto">
      <p className="text-xs font-bold uppercase tracking-wider text-primary font-label mb-2">Resource</p>
      <h2 className="text-2xl md:text-3xl font-bold font-headline text-on-surface tracking-tight">
        Resource details
      </h2>
      <p className="text-on-surface-variant mt-3 font-body text-sm md:text-base leading-relaxed">
        Detail view for resource ID <span className="font-mono font-semibold text-on-surface">{resourceId}</span> is
        not implemented yet.
      </p>
      <Link
        to="/resources"
        className="inline-flex mt-6 text-sm font-bold text-primary hover:underline"
      >
        Back to catalogue
      </Link>
    </div>
  );
}
