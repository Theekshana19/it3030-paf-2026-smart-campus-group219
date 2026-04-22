import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{
 *  value: string|number;
 *  onChange: (value: string) => void;
 *  resources: Array<{resourceId:number;resourceName:string;}>;
 *  loading?: boolean;
 *  error?: string;
 * }} props
 */
export default function ResourceSelectField({ value, onChange, resources, loading = false, error }) {
  return (
    <div className="space-y-2">
      <div className="relative group">
        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={loading}
          className="w-full pl-10 pr-10 py-3 bg-surface-container-low border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary appearance-none cursor-pointer disabled:opacity-70"
        >
          <option value="">{loading ? 'Loading resources...' : 'Select resource'}</option>
          {resources.map((resource) => (
            <option key={resource.resourceId} value={resource.resourceId}>
              {resource.resourceName}
            </option>
          ))}
        </select>
        <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
      </div>
      {error ? <p className="text-xs text-error ml-1">{error}</p> : null}
    </div>
  );
}
