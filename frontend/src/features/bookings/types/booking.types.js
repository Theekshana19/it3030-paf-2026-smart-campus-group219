/**
 * @typedef {'PENDING'|'APPROVED'|'REJECTED'|'CANCELLED'} BookingStatus
 */

/**
 * @typedef {Object} BookingListItem
 * @property {number} bookingId
 * @property {string} bookingRef
 * @property {number} resourceId
 * @property {string} resourceName
 * @property {string} resourceCode
 * @property {string} resourceType
 * @property {string|undefined} building
 * @property {number|undefined} capacity
 * @property {string} userEmail
 * @property {string} userName
 * @property {string} bookingDate
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} purpose
 * @property {number|undefined} expectedCount
 * @property {BookingStatus} bookingStatus
 * @property {string|undefined} adminRemark
 * @property {string|undefined} reviewedBy
 * @property {string|undefined} reviewedAt
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} BookingListResponse
 * @property {BookingListItem[]} items
 * @property {number} totalItems
 * @property {number} page
 * @property {number} size
 * @property {number} totalPages
 */

/**
 * @typedef {Object} BookingListQuery
 * @property {number|undefined} resourceId
 * @property {BookingStatus|undefined} status
 * @property {string|undefined} userEmail
 * @property {string|undefined} dateFrom
 * @property {string|undefined} dateTo
 * @property {string|undefined} search
 * @property {number|undefined} page
 * @property {number|undefined} size
 * @property {string|undefined} sortBy
 * @property {'asc'|'desc'|undefined} sortDir
 */

/**
 * @typedef {Object} BookingCreatePayload
 * @property {number} resourceId
 * @property {string} userEmail
 * @property {string} userName
 * @property {string} bookingDate
 * @property {string} startTime
 * @property {string} endTime
 * @property {string} purpose
 * @property {number|undefined} expectedCount
 */

/**
 * @typedef {Object} ConflictDetail
 * @property {string} conflictBookingRef
 * @property {string} conflictStartTime
 * @property {string} conflictEndTime
 * @property {string|undefined} conflictPurpose
 * @property {number|undefined} conflictAttendees
 * @property {string|undefined} nextAvailableSlot
 * @property {string[]|undefined} alternativeResources
 */

// booking status options for dropdowns
export const BOOKING_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

// sort field options for booking list
export const BOOKING_SORT_FIELDS = [
  { value: 'bookingDate', label: 'Date' },
  { value: 'startTime', label: 'Start Time' },
  { value: 'bookingStatus', label: 'Status' },
  { value: 'userName', label: 'User' },
  { value: 'bookingRef', label: 'Reference' },
  { value: 'createdAt', label: 'Created' },
  { value: 'updatedAt', label: 'Updated' },
];
