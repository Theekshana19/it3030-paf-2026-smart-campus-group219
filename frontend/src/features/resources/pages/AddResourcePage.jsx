import { useCallback, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addResourceSchema } from '../validation/addResourceSchema.js';
import { mapFormToCreatePayload } from '../../../utils/mapFormToCreatePayload.js';
import * as resourcesApi from '../api/resourcesApi.js';
import * as tagsApi from '../api/tagsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { EQUIPMENT_SUBTYPES, RESOURCE_TYPES } from '../types/resource.types.js';
import { useResourceTags } from '../hooks/useResourceTags.js';
import ResourceFormSection from '../components/ResourceFormSection.jsx';
import DayToggleGroup from '../components/DayToggleGroup.jsx';
import StatusRadioGroup from '../components/StatusRadioGroup.jsx';
import ResourceFeaturesCard from '../components/ResourceFeaturesCard.jsx';
import LivePreviewCard from '../components/LivePreviewCard.jsx';
import SmartTipsCard from '../components/SmartTipsCard.jsx';
import PageActionButtons from '../components/PageActionButtons.jsx';
import { successAlert } from '../../../utils/sweetAlerts.js';

const defaultValues = {
  resourceName: '',
  resourceCode: '',
  resourceType: 'LAB',
  equipmentSubtype: '',
  description: '',
  capacity: 30,
  building: '',
  floor: '',
  roomOrAreaIdentifier: '',
  defaultAvailableFrom: '08:00',
  defaultAvailableTo: '20:00',
  workingDays: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  status: 'ACTIVE',
};

const inputClass =
  'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';
const labelClass =
  'block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 font-label';

export default function AddResourcePage() {
  const navigate = useNavigate();
  const { ensureTag } = useResourceTags();
  const [selectedTags, setSelectedTags] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(addResourceSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const watched = watch();
  const isEquipmentType = watched.resourceType === 'EQUIPMENT';

  const runCreate = useCallback(
    async (data, resetAfter) => {
      try {
        const payload = mapFormToCreatePayload(data);
        const created = await resourcesApi.createResource(payload);
        const resourceId = created.resourceId;
        for (const t of selectedTags) {
          try {
            await tagsApi.addTagToResource(resourceId, t.tagId);
          } catch (e) {
            console.warn('Tag attach failed', t.tagId, e);
          }
        }
        await successAlert({ title: 'Resource saved successfully' });
        if (resetAfter) {
          reset({ ...defaultValues });
          setSelectedTags([]);
        } else {
          navigate('/dashboard');
        }
        return true;
      } catch (e) {
        toast.error(getErrorMessage(e));
        return false;
      }
    },
    [navigate, reset, selectedTags]
  );

  const onAddTag = useCallback((tag) => {
    setSelectedTags((prev) => {
      if (prev.some((p) => p.tagId === tag.tagId)) return prev;
      return [...prev, tag];
    });
  }, []);

  const onRemoveTag = useCallback((tagId) => {
    setSelectedTags((prev) => prev.filter((t) => t.tagId !== tagId));
  }, []);

  const handleCreateTagInput = useCallback(
    async (name) => {
      return ensureTag(name);
    },
    [ensureTag]
  );

  const onValidSubmit = useCallback(
    async (data) => {
      await runCreate(data, false);
    },
    [runCreate]
  );

  const previewProps = useMemo(
    () => ({
      resourceName: watched.resourceName,
      resourceCode: watched.resourceCode,
      building: watched.building,
      roomOrAreaIdentifier: watched.roomOrAreaIdentifier,
      floor: watched.floor,
      status: watched.status,
      capacity: watched.capacity,
      fromTime: watched.defaultAvailableFrom,
      toTime: watched.defaultAvailableTo,
    }),
    [watched]
  );

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto w-full grid grid-cols-12 gap-6 lg:gap-8 items-start">
      <div className="col-span-12 lg:col-span-8 space-y-7 md:space-y-8">
        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-7 md:space-y-8" noValidate>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-3xl md:text-[2rem] font-bold text-on-surface font-headline tracking-tight leading-tight">
                Create New Resource
              </h2>
              <p className="text-on-surface-variant font-body mt-2 text-sm md:text-base max-w-xl">
                Populate the fields below to register a new campus facility.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-outline-variant font-semibold text-secondary text-sm hover:bg-surface-container-low transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">save</span>
                Save Resource
              </button>
            </div>
          </div>

          <div className="space-y-6 md:space-y-7">
            <ResourceFormSection title="Basic Information" icon="info">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Resource Name</label>
                  <input
                    {...register('resourceName')}
                    className={inputClass}
                    placeholder="e.g. Quantum Computing Lab A"
                    type="text"
                    autoComplete="off"
                  />
                  {errors.resourceName && (
                    <p className="text-error text-xs mt-1.5">{errors.resourceName.message}</p>
                  )}
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className={labelClass}>Resource Code</label>
                  <input
                    {...register('resourceCode')}
                    className={inputClass}
                    placeholder="e.g. QCL-001-A"
                    type="text"
                    autoComplete="off"
                  />
                  {errors.resourceCode && (
                    <p className="text-error text-xs mt-1.5">{errors.resourceCode.message}</p>
                  )}
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Type</label>
                  <select {...register('resourceType')} className={inputClass}>
                    {RESOURCE_TYPES.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.resourceType && (
                    <p className="text-error text-xs mt-1.5">{errors.resourceType.message}</p>
                  )}
                </div>
                {isEquipmentType ? (
                  <div className="col-span-2">
                    <label className={labelClass}>Equipment Subtype</label>
                    <select {...register('equipmentSubtype')} className={inputClass}>
                      <option value="">Select equipment subtype</option>
                      {EQUIPMENT_SUBTYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {errors.equipmentSubtype && (
                      <p className="text-error text-xs mt-1.5">{errors.equipmentSubtype.message}</p>
                    )}
                  </div>
                ) : null}
                <div className="col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    {...register('description')}
                    className={inputClass}
                    placeholder="Brief overview of the resource purpose and key features..."
                    rows={3}
                  />
                </div>
              </div>
            </ResourceFormSection>

            <ResourceFormSection
              title="Capacity & Location"
              icon="location_on"
              iconWrapClassName="bg-secondary-fixed"
              iconClassName="text-secondary"
            >
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 md:col-span-2">
                  <label className={labelClass}>Capacity (Persons)</label>
                  <input {...register('capacity')} className={inputClass} type="number" min={0} />
                  {errors.capacity && (
                    <p className="text-error text-xs mt-1.5">{errors.capacity.message}</p>
                  )}
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className={labelClass}>Building Name</label>
                  <input
                    {...register('building')}
                    className={inputClass}
                    placeholder="e.g. Turing Center for Innovation"
                    type="text"
                  />
                  {errors.building && (
                    <p className="text-error text-xs mt-1.5">{errors.building.message}</p>
                  )}
                </div>
                <div className="col-span-6 md:col-span-3">
                  <label className={labelClass}>Floor</label>
                  <input
                    {...register('floor')}
                    className={inputClass}
                    placeholder="e.g. 4th Floor"
                    type="text"
                  />
                </div>
                <div className="col-span-6 md:col-span-3">
                  <label className={labelClass}>Room ID</label>
                  <input
                    {...register('roomOrAreaIdentifier')}
                    className={inputClass}
                    placeholder="e.g. RM-402"
                    type="text"
                  />
                </div>
              </div>
            </ResourceFormSection>

            <ResourceFormSection
              title="Availability Window"
              icon="schedule"
              iconWrapClassName="bg-tertiary-fixed"
              iconClassName="text-tertiary"
            >
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>From Time</label>
                  <input
                    {...register('defaultAvailableFrom')}
                    className={inputClass}
                    type="time"
                  />
                  {errors.defaultAvailableFrom && (
                    <p className="text-error text-xs mt-1.5">{errors.defaultAvailableFrom.message}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>To Time</label>
                  <input {...register('defaultAvailableTo')} className={inputClass} type="time" />
                  {errors.defaultAvailableTo && (
                    <p className="text-error text-xs mt-1.5">{errors.defaultAvailableTo.message}</p>
                  )}
                </div>
                <Controller
                  name="workingDays"
                  control={control}
                  render={({ field }) => (
                    <DayToggleGroup
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.workingDays?.message}
                    />
                  )}
                />
              </div>
            </ResourceFormSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResourceFormSection
                title="Initial Status"
                icon="settings_input_component"
                iconWrapClassName="bg-error-container"
                iconClassName="text-error"
              >
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <StatusRadioGroup value={field.value} onChange={field.onChange} />
                  )}
                />
              </ResourceFormSection>
              <ResourceFeaturesCard
                selectedTags={selectedTags}
                onAddTag={onAddTag}
                onRemoveTag={onRemoveTag}
                onCreateTag={handleCreateTagInput}
              />
            </div>

            <PageActionButtons onCancel={() => navigate(-1)} loading={isSubmitting} />
          </div>
        </form>
      </div>

      <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-28 space-y-6">
        <LivePreviewCard {...previewProps} />
        <SmartTipsCard />
      </div>
    </div>
  );
}
