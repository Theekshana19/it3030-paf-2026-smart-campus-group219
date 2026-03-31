/**
 * @typedef {'LECTURE_HALL'|'LAB'|'MEETING_ROOM'|'EQUIPMENT'} ResourceType
 */

/**
 * @typedef {'ACTIVE'|'OUT_OF_SERVICE'} ResourceStatus
 */

/**
 * @typedef {'ACTIVE'|'OUT_OF_SERVICE'} ScheduledStatus
 */

/**
 * @typedef {'AVAILABLE_NOW'|'BUSY_SOON'|'FULLY_BOOKED_TODAY'|'OUT_OF_SERVICE'} SmartAvailabilityStatus
 */

/**
 * @typedef {Object} ResourceTagDto
 * @property {number} tagId
 * @property {string} tagName
 */

/**
 * Row returned in list/detail (subset used by catalogue).
 * @typedef {Object} ResourceListItem
 * @property {number} resourceId
 * @property {string} resourceCode
 * @property {string} resourceName
 * @property {ResourceType} resourceType
 * @property {string|undefined|null} equipmentSubtype
 * @property {number|null|undefined} capacity
 * @property {string|undefined} building
 * @property {string|undefined} floor
 * @property {string|undefined} roomOrAreaIdentifier
 * @property {ResourceStatus} status
 * @property {string|undefined|null} smartAvailabilityStatus
 * @property {string|undefined|null} nextBookingTime
 * @property {ResourceTagDto[]|undefined} tags
 */

/**
 * @typedef {Object} ResourceListResponse
 * @property {ResourceListItem[]} items
 * @property {number} totalItems
 * @property {number} page
 * @property {number} size
 * @property {number} totalPages
 */

/**
 * Query params for GET /api/resources
 * @typedef {Object} ResourceListQuery
 * @property {ResourceType|undefined} type
 * @property {number|undefined} minCapacity
 * @property {string|undefined} building
 * @property {ResourceStatus|undefined} status
 * @property {string|undefined} tag
 * @property {string|undefined} search
 * @property {number|undefined} page
 * @property {number|undefined} size
 * @property {string|undefined} sortBy
 * @property {'asc'|'desc'|undefined} sortDir
 */

/**
 * @typedef {Object} ResourceCreatePayload
 * @property {string} resourceCode
 * @property {string} resourceName
 * @property {ResourceType} resourceType
 * @property {string|undefined} equipmentSubtype
 * @property {number|null|undefined} capacity
 * @property {string} building
 * @property {string|undefined} floor
 * @property {string|undefined} roomOrAreaIdentifier
 * @property {string|undefined} fullLocationDescription
 * @property {string|undefined} defaultAvailableFrom
 * @property {string|undefined} defaultAvailableTo
 * @property {string|undefined} workingDays
 * @property {ResourceStatus} status
 * @property {string|undefined} statusNotes
 * @property {string|undefined} description
 * @property {boolean} isActive
 */

export const RESOURCE_TYPES = [
  { value: 'LAB', label: 'Laboratory' },
  { value: 'LECTURE_HALL', label: 'Lecture Hall' },
  { value: 'MEETING_ROOM', label: 'Meeting Room' },
  { value: 'EQUIPMENT', label: 'Equipment' },
];

export const EQUIPMENT_SUBTYPES = [
  { value: 'PROJECTOR', label: 'Projector' },
  { value: 'CAMERA', label: 'Camera' },
  { value: 'MICROPHONE', label: 'Microphone' },
  { value: 'SPEAKER', label: 'Speaker' },
  { value: 'DISPLAY', label: 'Display / Monitor' },
  { value: 'LAPTOP', label: 'Laptop' },
  { value: 'TABLET', label: 'Tablet' },
  { value: 'OTHER', label: 'Other' },
];

/** Backend-allowed sortBy values (see README) */
export const RESOURCE_SORT_FIELDS = [
  { value: 'resourceName', label: 'Name' },
  { value: 'resourceCode', label: 'Code' },
  { value: 'resourceType', label: 'Type' },
  { value: 'building', label: 'Building' },
  { value: 'capacity', label: 'Capacity' },
  { value: 'status', label: 'Status' },
  { value: 'createdAt', label: 'Created' },
  { value: 'updatedAt', label: 'Updated' },
];

export const OPERATIONAL_STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'OUT_OF_SERVICE', label: 'Out of service' },
];

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export const SCHEDULED_STATUS_OPTIONS = [
  { value: 'OUT_OF_SERVICE', label: 'Maintenance (Out of Service)' },
  { value: 'ACTIVE', label: 'Active' },
];
