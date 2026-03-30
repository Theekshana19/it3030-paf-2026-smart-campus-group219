import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ title: string; icon: string; iconWrapClassName?: string; iconClassName?: string; children: import('react').ReactNode }} props
 */
export default function ResourceFormSection({
  title,
  icon,
  iconWrapClassName = 'bg-primary-fixed',
  iconClassName = 'text-primary',
  children,
}) {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 md:p-7 shadow-[0_32px_32px_-4px_rgba(23,28,31,0.05)] border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-5 md:mb-6">
        <span
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconWrapClassName}`}
        >
          <Icon name={icon} className={`text-xl ${iconClassName}`} />
        </span>
        <h3 className="font-headline text-lg font-bold text-on-surface">{title}</h3>
      </div>
      {children}
    </section>
  );
}
