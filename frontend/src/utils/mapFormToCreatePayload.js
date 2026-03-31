/**
 * @param {string|undefined} t
 * @returns {string|undefined}
 */
function normalizeTime(t) {
  if (!t || typeof t !== 'string') return undefined;
  const trimmed = t.trim();
  if (trimmed.length === 5) return `${trimmed}:00`;
  return trimmed;
}

/**
 * @param {string[]} days
 */
export function buildWorkingDaysString(days) {
  if (!days?.length) return undefined;
  return days.join(',');
}

/**
 * @param {Record<string, unknown>} values
 */
export function mapFormToCreatePayload(values) {
  const capacityRaw = values.capacity;
  const capacity =
    capacityRaw === '' || capacityRaw === null || capacityRaw === undefined
      ? null
      : Number(capacityRaw);

  return {
    resourceCode: values.resourceCode.trim(),
    resourceName: values.resourceName.trim(),
    resourceType: values.resourceType,
    equipmentSubtype:
      values.resourceType === 'EQUIPMENT' ? values.equipmentSubtype?.trim() || undefined : undefined,
    capacity: Number.isNaN(capacity) ? null : capacity,
    building: values.building.trim(),
    floor: values.floor?.trim() || undefined,
    roomOrAreaIdentifier: values.roomOrAreaIdentifier?.trim() || undefined,
    fullLocationDescription: undefined,
    defaultAvailableFrom: normalizeTime(values.defaultAvailableFrom),
    defaultAvailableTo: normalizeTime(values.defaultAvailableTo),
    workingDays: buildWorkingDaysString(values.workingDays),
    status: values.status,
    statusNotes: undefined,
    description: values.description?.trim() || undefined,
    isActive: values.status === 'ACTIVE',
  };
}
