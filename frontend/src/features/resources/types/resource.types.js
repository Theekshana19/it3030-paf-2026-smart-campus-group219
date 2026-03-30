/**
 * @typedef {'LECTURE_HALL'|'LAB'|'MEETING_ROOM'|'EQUIPMENT'} ResourceType
 */

/**
 * @typedef {'ACTIVE'|'OUT_OF_SERVICE'} ResourceStatus
 */

/**
 * @typedef {Object} ResourceCreatePayload
 * @property {string} resourceCode
 * @property {string} resourceName
 * @property {ResourceType} resourceType
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

/**
 * @typedef {Object} ResourceTagDto
 * @property {number} tagId
 * @property {string} tagName
 */

export const RESOURCE_TYPES = [
  { value: 'LAB', label: 'Laboratory' },
  { value: 'LECTURE_HALL', label: 'Lecture Hall' },
  { value: 'MEETING_ROOM', label: 'Meeting Room' },
  { value: 'EQUIPMENT', label: 'Equipment' },
];

export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
