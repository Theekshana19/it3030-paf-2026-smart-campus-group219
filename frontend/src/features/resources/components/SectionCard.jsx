/**
 * Card shell matching the Stitch edit layout.
 * @param {{
 *   title?: string;
 *   icon?: string;
 *   iconWrapClassName?: string;
 *   iconClassName?: string;
 *   children: import('react').ReactNode;
 *   className?: string;
 * }} props
 */
import Icon from '../../../components/common/Icon.jsx';

export default function SectionCard({
  title,
  icon,
  iconWrapClassName = 'bg-surface-container-low rounded-lg',
  iconClassName = 'text-secondary',
  children,
  className = '',
}) {
  return (
    <section className={['bg-surface-container-lowest rounded-xl p-8 shadow-sm', className].join(' ')}>
      {title ? (
        <div className="flex items-center gap-3 mb-6">
          {icon ? (
            <span className={['w-8 h-8 rounded-lg flex items-center justify-center', iconWrapClassName].join(' ')}>
              <Icon name={icon} className={iconClassName} />
            </span>
          ) : null}
          <h3 className="text-lg font-bold font-manrope text-on-surface">{title}</h3>
        </div>
      ) : null}
      {children}
    </section>
  );
}

