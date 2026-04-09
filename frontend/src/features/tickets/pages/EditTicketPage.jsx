import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
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

// this page lets users edit a ticket that is still in OPEN status
// once the ticket moves to another status, it cannot be edited here
export default function EditTicketPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),
    mode: 'onTouched',
  });

  // load the existing ticket data and the resource list
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [ticketData, resourceData] = await Promise.all([
          ticketsApi.getTicketById(ticketId),
          resourcesApi.listResources({ size: 100, sortBy: 'resourceName', sortDir: 'asc' }),
        ]);

        if (cancelled) return;

        // only open tickets can be edited through this form
        if (ticketData.ticketStatus !== 'OPEN') {
          toast.error('Only open tickets can be edited');
          navigate(`/tickets/${ticketId}`);
          return;
        }

        setResources(resourceData.items || []);
        reset({
          title: ticketData.title,
          category: ticketData.category,
          priority: ticketData.priority,
          resourceId: ticketData.resourceId || '',
          locationDesc: ticketData.locationDesc,
          description: ticketData.description,
          reporterEmail: ticketData.reporterEmail,
          reporterName: ticketData.reporterName,
          contactPhone: ticketData.contactPhone || '',
          contactMethod: ticketData.contactMethod || 'EMAIL',
        });
      } catch (e) {
        if (!cancelled) {
          toast.error(getErrorMessage(e));
          navigate('/tickets');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [ticketId]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        ...data,
        resourceId: data.resourceId ? Number(data.resourceId) : null,
        contactPhone: data.contactPhone || null,
        contactMethod: data.contactMethod || null,
      };
      await ticketsApi.updateTicket(ticketId, payload);
      await successAlert({ title: 'Ticket updated successfully' });
      navigate(`/tickets/${ticketId}`);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  if (loading) {
    return (
      <div className="p-8 md:p-10 max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-surface-container-high rounded w-64" />
        <div className="h-48 bg-surface-container-high rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button type="button" onClick={() => navigate(`/tickets/${ticketId}`)}
          className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
          <Icon name="arrow_back" className="text-xl text-on-surface-variant" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Edit Ticket</h1>
          <p className="text-on-surface-variant text-sm mt-1 font-body">Update the details of this open ticket.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* issue information section */}
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
              <input type="text" {...register('title')} className={inputClass} />
              {errors.title?.message && <p className="text-error text-xs font-medium">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Category</label>
              <select {...register('category')} className={inputClass}>
                {TICKET_CATEGORY_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Priority</label>
              <select {...register('priority')} className={inputClass}>
                {TICKET_PRIORITY_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          </div>
        </div>

        {/* location section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="location_on" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Resource</label>
              <select {...register('resourceId')} className={inputClass}>
                <option value="">No specific resource</option>
                {resources.map((r) => (<option key={r.resourceId} value={r.resourceId}>{r.resourceName} ({r.building})</option>))}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Location</label>
              <input type="text" {...register('locationDesc')} className={inputClass} />
              {errors.locationDesc?.message && <p className="text-error text-xs font-medium">{errors.locationDesc.message}</p>}
            </div>
          </div>
        </div>

        {/* description section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="description" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Description</h3>
          </div>
          <textarea {...register('description')} rows={5} className={inputClass} />
          {errors.description?.message && <p className="text-error text-xs font-medium mt-1">{errors.description.message}</p>}
        </div>

        {/* contact section */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <Icon name="contact_mail" className="text-xl" />
            </span>
            <h3 className="text-lg font-bold font-manrope">Contact</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClass}>Name</label>
              <input type="text" {...register('reporterName')} className={inputClass} />
              {errors.reporterName?.message && <p className="text-error text-xs font-medium">{errors.reporterName.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Email</label>
              <input type="email" {...register('reporterEmail')} className={inputClass} />
              {errors.reporterEmail?.message && <p className="text-error text-xs font-medium">{errors.reporterEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Phone</label>
              <input type="tel" {...register('contactPhone')} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Preferred Contact</label>
              <select {...register('contactMethod')} className={inputClass}>
                {CONTACT_METHOD_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate(`/tickets/${ticketId}`)}
            className="px-6 py-2.5 rounded-lg font-bold text-sm font-manrope text-on-surface-variant hover:bg-surface-container-high transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity disabled:opacity-50">
            <Icon name="save" className="text-lg" />
            {isSubmitting ? 'Saving...' : 'Update Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
}
