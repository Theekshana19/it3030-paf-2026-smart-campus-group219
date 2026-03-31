import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import * as resourcesApi from '../api/resourcesApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { confirmDeleteAlert, successAlert } from '../../../utils/sweetAlerts.js';
import ResourceDetailsHeader from '../components/ResourceDetailsHeader.jsx';
import ResourceActionsBar from '../components/ResourceActionsBar.jsx';
import ResourceBasicInfoCard from '../components/ResourceBasicInfoCard.jsx';
import ResourceOperatingHoursCard from '../components/ResourceOperatingHoursCard.jsx';
import ResourceCurrentTimelineCard from '../components/ResourceCurrentTimelineCard.jsx';
import ResourceRecentActivityCard from '../components/ResourceRecentActivityCard.jsx';
import ResourceLocationAccessCard from '../components/ResourceLocationAccessCard.jsx';
import ResourceActiveTagsCard from '../components/ResourceActiveTagsCard.jsx';
import ResourceOptimizationCard from '../components/ResourceOptimizationCard.jsx';
import {
  buildDetailsTimelineSegments,
  buildFallbackActivity,
  buildOperatingHoursRows,
  formatResourcePathLabel,
  todayIsoLocal,
} from '../utils/resourceDetailsAdapters.js';

function CardSkeleton({ className = '' }) {
  return <div className={`bg-surface-container-lowest rounded-xl shadow-sm animate-pulse ${className}`} />;
}

function formatLocation(resource) {
  const parts = [
    resource?.fullLocationDescription,
    resource?.building,
    resource?.floor ? `Floor ${resource.floor}` : null,
    resource?.roomOrAreaIdentifier,
  ].filter(Boolean);
  return parts.join(', ');
}

export default function ResourceDetailsPage() {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!resourceId) return;
    setLoading(true);
    setError(null);
    try {
      const [resourceData, scheduleData] = await Promise.all([
        resourcesApi.getResourceById(resourceId),
        resourcesApi.listResourceStatusSchedules(resourceId),
      ]);
      setResource(resourceData);
      setSchedules(Array.isArray(scheduleData) ? scheduleData : []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [resourceId]);

  useEffect(() => {
    load();
  }, [load]);

  const categoryLabel = useMemo(() => formatResourcePathLabel(resource), [resource]);
  const breadcrumbLabel = useMemo(() => resource?.resourceCode || `Resource ${resourceId}`, [resource?.resourceCode, resourceId]);
  const locationText = useMemo(() => formatLocation(resource), [resource]);
  const hoursRows = useMemo(
    () => buildOperatingHoursRows(resource?.workingDays, resource?.defaultAvailableFrom, resource?.defaultAvailableTo),
    [resource?.defaultAvailableFrom, resource?.defaultAvailableTo, resource?.workingDays]
  );

  const timelineSegments = useMemo(() => {
    const today = todayIsoLocal();
    const todaySchedules = schedules.filter((s) => String(s?.scheduleDate || '') === today);
    return buildDetailsTimelineSegments(todaySchedules);
  }, [schedules]);

  const activities = useMemo(() => buildFallbackActivity(resource), [resource]);

  const handleDelete = useCallback(async () => {
    if (!resourceId) return;
    const ok = await confirmDeleteAlert({
      title: 'Delete Resource?',
      text: 'This action is permanent and will remove this resource and related mappings.',
    });
    if (!ok) return;
    setDeleting(true);
    try {
      await resourcesApi.deleteResource(resourceId);
      await successAlert({ title: 'Resource deleted' });
      navigate('/resources');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }, [navigate, resourceId]);

  if (loading) {
    return (
      <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
        <CardSkeleton className="h-28" />
        <CardSkeleton className="h-16" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <CardSkeleton className="h-64" />
            <CardSkeleton className="h-64" />
          </div>
          <div className="lg:col-span-4 space-y-8">
            <CardSkeleton className="h-64" />
            <CardSkeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 md:p-10 max-w-3xl mx-auto">
        <div className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-on-error-container font-body">
          {getErrorMessage(error)}{' '}
          <button type="button" className="font-bold underline ml-1" onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1440px] mx-auto w-full space-y-8">
      <ResourceDetailsHeader
        breadcrumbCategory={categoryLabel}
        breadcrumbLabel={breadcrumbLabel}
        resourceName={resource?.resourceName}
        locationText={locationText}
        smartAvailabilityStatus={resource?.smartAvailabilityStatus}
        nextBookingTime={resource?.nextBookingTime}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div />
        <ResourceActionsBar
          onEdit={() => navigate(`/resources/${resourceId}/edit`)}
          onSchedule={() => navigate(`/resources/${resourceId}/schedules`)}
          onViewBookings={() => toast.message('Bookings module is coming soon')}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResourceBasicInfoCard resource={resource} />
            <ResourceOperatingHoursCard rows={hoursRows} />
          </div>

          <ResourceCurrentTimelineCard segments={timelineSegments} />
          <ResourceRecentActivityCard activities={activities} />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <ResourceLocationAccessCard
            zone={resource?.building ? `${resource.building} Wing` : 'Campus Wing'}
            note={resource?.fullLocationDescription || 'Restricted access badge required after 18:00.'}
            mapLabel={`${resource?.building || 'Building'} Map`}
          />
          <ResourceActiveTagsCard tags={resource?.tags || []} />
          <ResourceOptimizationCard
            utilization={resource?.todayBookingCount != null ? Math.min(100, Number(resource.todayBookingCount) * 12) : undefined}
            note={
              resource?.smartAvailabilityStatus === 'OUT_OF_SERVICE'
                ? 'Resource is currently out of service. Prioritize maintenance completion.'
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}

