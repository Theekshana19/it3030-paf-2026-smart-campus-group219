/**
 * Material Symbols Outlined wrapper
 * @param {{ name: string; className?: string; 'data-icon'?: string }} props
 */
export default function Icon({ name, className = '', ...rest }) {
  return (
    <span className={`material-symbols-outlined ${className}`.trim()} {...rest}>
      {name}
    </span>
  );
}
