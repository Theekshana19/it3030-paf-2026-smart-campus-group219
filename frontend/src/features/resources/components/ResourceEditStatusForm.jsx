import { Controller } from 'react-hook-form';
import StatusRadioGroup from './StatusRadioGroup.jsx';
import Icon from '../../../components/common/Icon.jsx';

/**
 * @param {{ control: any; register: any; errors: Record<string, any> }} props
 */
export default function ResourceEditStatusForm({ control, register, errors }) {
  const labelClass =
    'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

  const notesError = errors.statusNotes?.message;

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-8 h-8 rounded-lg bg-error-container flex items-center justify-center text-error">
          <Icon name="settings_input_component" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Initial Status</h3>
      </div>

      <div className="space-y-3">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <StatusRadioGroup value={field.value} onChange={field.onChange} />
          )}
        />

        <div className="space-y-2 pt-2">
          <label className={labelClass}>Status Notes (optional)</label>
          <textarea
            {...register('statusNotes')}
            rows={3}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none"
            placeholder="Add a short note about the operational status..."
          />
          {notesError ? <p className="text-error text-xs font-medium mt-1">{notesError}</p> : null}
        </div>
      </div>
    </div>
  );
}

