/**
 * @typedef {'OPEN'|'IN_PROGRESS'|'RESOLVED'|'CLOSED'|'REJECTED'} TicketStatus
 */

/**
 * @typedef {'LOW'|'MEDIUM'|'HIGH'|'URGENT'} TicketPriority
 */

/**
 * @typedef {'ELECTRICAL'|'PLUMBING'|'IT_EQUIPMENT'|'FURNITURE'|'HVAC'|'CLEANING'|'OTHER'} TicketCategory
 */

/**
 * @typedef {Object} TicketAttachmentDto
 * @property {number} attachmentId
 * @property {string} fileName
 * @property {number} fileSize
 * @property {string} contentType
 * @property {string} createdAt
 */

/**
 * @typedef {Object} TicketListItem
 * @property {number} ticketId
 * @property {string} ticketRef
 * @property {number|null} resourceId
 * @property {string|null} resourceName
 * @property {string|null} resourceCode
 * @property {string} locationDesc
 * @property {TicketCategory} category
 * @property {string} title
 * @property {string} description
 * @property {TicketPriority} priority
 * @property {string} reporterEmail
 * @property {string} reporterName
 * @property {string|null} contactPhone
 * @property {string|null} contactMethod
 * @property {TicketStatus} ticketStatus
 * @property {string|null} assignedToEmail
 * @property {string|null} assignedToName
 * @property {string|null} assignedAt
 * @property {string|null} resolutionNotes
 * @property {string|null} resolvedAt
 * @property {string|null} closedAt
 * @property {string|null} rejectReason
 * @property {boolean} isActive
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} attachmentCount
 * @property {number} commentCount
 * @property {TicketAttachmentDto[]} attachments
 */

/**
 * @typedef {Object} TicketListResponse
 * @property {TicketListItem[]} items
 * @property {number} totalItems
 * @property {number} page
 * @property {number} size
 * @property {number} totalPages
 */

/**
 * @typedef {Object} CommentDto
 * @property {number} commentId
 * @property {string} authorEmail
 * @property {string} authorName
 * @property {string} commentText
 * @property {boolean} isEdited
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PatternAlertDto
 * @property {string|null} resourceName
 * @property {string|null} category
 * @property {number} ticketCount
 * @property {boolean} isRecurring
 * @property {string|null} recommendation
 */

// ticket status options for filter dropdowns
export const TICKET_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'REJECTED', label: 'Rejected' },
];

// priority levels for the ticket form
export const TICKET_PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

// issue categories for the ticket form
export const TICKET_CATEGORY_OPTIONS = [
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'IT_EQUIPMENT', label: 'IT Equipment' },
  { value: 'FURNITURE', label: 'Furniture' },
  { value: 'HVAC', label: 'HVAC / Air Conditioning' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'OTHER', label: 'Other' },
];

// contact method options
export const CONTACT_METHOD_OPTIONS = [
  { value: 'EMAIL', label: 'Email' },
  { value: 'PHONE', label: 'Phone' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
];

// sort fields for ticket list
export const TICKET_SORT_FIELDS = [
  { value: 'createdAt', label: 'Created' },
  { value: 'priority', label: 'Priority' },
  { value: 'ticketStatus', label: 'Status' },
  { value: 'category', label: 'Category' },
  { value: 'title', label: 'Title' },
  { value: 'updatedAt', label: 'Updated' },
];
