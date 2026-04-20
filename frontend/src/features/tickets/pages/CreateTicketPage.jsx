import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ticketSchema } from '../validation/ticketSchema.js';
import * as ticketsApi from '../api/ticketsApi.js';
import * as resourcesApi from '../../resources/api/resourcesApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { successAlert } from '../../../utils/sweetAlerts.js';
import { TICKET_CATEGORY_OPTIONS, TICKET_PRIORITY_OPTIONS, CONTACT_METHOD_OPTIONS } from '../types/ticket.types.js';
import Icon from '../../../components/common/Icon.jsx';

const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';
const labelClass = 'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

const defaultValues = {
  title: '',
  category: 'IT_EQUIPMENT',
  priority: 'MEDIUM',
  resourceId: '',
  locationDesc: '',
  description: '',
  reporterEmail: '',
  reporterName: '',
  contactPhone: '',
  contactMethod: 'EMAIL',
};

// this page allows users to report a new incident or maintenance issue
// the form has 4 sections: issue info, location, description, and contact
export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues,
    mode: 'onTouched',
  });

  // load resources for the optional resource dropdown
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await resourcesApi.listResources({ size: 100, sortBy: 'resourceName', sortDir: 'asc' });
        if (!cancelled) setResources(data.items || []);
      } catch {
        if (!cancelled) setResources([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        resourceId: data.resourceId ? Number(data.resourceId) : null,
        contactPhone: data.contactPhone || null,
        contactMethod: data.contactMethod || null,
      };
      await ticketsApi.createTicket(payload);
      await successAlert({ title: 'Ticket submitted successfully' });
      navigate('/tickets');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  return (
    <div className="p-8 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Report an Issue</h1>
        <p className="text-on-surface-variant text-sm mt-1 font-body">Fill in the details below to create an incident ticket.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* section 1: issue information */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="info" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Issue Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className={labelClass}>Title</label>
              <input type="text" {...register('title')} className={inputClass} placeholder="Brief description of the issue" />
              {errors.title?.message && <p className="text-error text-xs font-medium">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Category</label>
              <select {...register('category')} className={inputClass}>
                {TICKET_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.category?.message && <p className="text-error text-xs font-medium">{errors.category.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Priority</label>
              <select {...register('priority')} className={inputClass}>
                {TICKET_PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.priority?.message && <p className="text-error text-xs font-medium">{errors.priority.message}</p>}
            </div>
          </div>
        </div>

        {/* section 2: location */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="location_on" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Resource (Optional)</label>
              <select {...register('resourceId')} className={inputClass}>
                <option value="">No specific resource</option>
                {resources.map((r) => (
                  <option key={r.resourceId} value={r.resourceId}>
                    {r.resourceName} ({r.building})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Location Description</label>
              <input type="text" {...register('locationDesc')} className={inputClass} placeholder="e.g. 2nd Floor, Main Building" />
              {errors.locationDesc?.message && <p className="text-error text-xs font-medium">{errors.locationDesc.message}</p>}
            </div>
          </div>
        </div>

        {/* section 3: detailed description */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="description" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Description</h3>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Describe the issue in detail</label>
            <textarea {...register('description')} rows={5} className={inputClass} placeholder="Explain the problem, what you observed, and any steps to reproduce..." />
            {errors.description?.message && <p className="text-error text-xs font-medium">{errors.description.message}</p>}
          </div>
        </div>

        {/* section 4: contact information */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="contact_mail" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Contact Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Your Name</label>
              <input type="text" {...register('reporterName')} className={inputClass} placeholder="Enter your name" />
              {errors.reporterName?.message && <p className="text-error text-xs font-medium">{errors.reporterName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Your Email</label>
              <input type="email" {...register('reporterEmail')} className={inputClass} placeholder="your.email@example.com" />
              {errors.reporterEmail?.message && <p className="text-error text-xs font-medium">{errors.reporterEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Phone (Optional)</label>
              <input type="tel" {...register('contactPhone')} className={inputClass} placeholder="077-1234567" />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Preferred Contact</label>
              <select {...register('contactMethod')} className={inputClass}>
                {CONTACT_METHOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* action buttons */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/tickets')}
            className="px-6 py-2.5 rounded-lg font-bold text-sm font-manrope text-on-surface-variant hover:bg-surface-container-high transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity disabled:opacity-50">
            <Icon name="send" className="text-lg" />
            {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
