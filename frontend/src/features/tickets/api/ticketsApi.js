import httpClient from '../../../services/httpClient.js';

/**
 * build clean query params for the ticket list endpoint
 * removes any empty or null values before sending
 */
function buildListQuery(raw) {
  const out = {};
  const keys = [
    'resourceId', 'status', 'priority', 'category',
    'reporterEmail', 'assignedToEmail', 'search',
    'page', 'size', 'sortBy', 'sortDir',
  ];
  for (const k of keys) {
    const v = raw[k];
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return out;
}

/**
 * get all tickets with filters and pagination
 * @param {Record<string, unknown>} params
 */
export async function listTickets(params = {}) {
  const { data } = await httpClient.get('/api/tickets', { params: buildListQuery(params) });
  return data;
}

/** create a new incident ticket */
export async function createTicket(payload) {
  const { data } = await httpClient.post('/api/tickets', payload);
  return data;
}

/** get a single ticket by id with all details */
export async function getTicketById(id) {
  const { data } = await httpClient.get(`/api/tickets/${id}`);
  return data;
}

/** update a ticket that is still in OPEN status */
export async function updateTicket(id, payload) {
  const { data } = await httpClient.put(`/api/tickets/${id}`, payload);
  return data;
}

/** delete a ticket permanently */
export async function deleteTicket(id) {
  await httpClient.delete(`/api/tickets/${id}`);
}

/** admin assigns a technician to work on the ticket */
export async function assignTicket(id, payload) {
  const { data } = await httpClient.patch(`/api/tickets/${id}/assign`, payload);
  return data;
}

/** technician resolves the ticket with resolution notes */
export async function resolveTicket(id, payload) {
  const { data } = await httpClient.patch(`/api/tickets/${id}/resolve`, payload);
  return data;
}

/** admin closes a resolved ticket */
export async function closeTicket(id) {
  const { data } = await httpClient.patch(`/api/tickets/${id}/close`);
  return data;
}

/** admin rejects a ticket with a reason */
export async function rejectTicket(id, payload) {
  const { data } = await httpClient.patch(`/api/tickets/${id}/reject`, payload);
  return data;
}

/** check if this resource has recurring issues */
export async function getPatternAlert(id) {
  const { data } = await httpClient.get(`/api/tickets/${id}/pattern-alert`);
  return data;
}

/** upload an image attachment to a ticket */
export async function uploadAttachment(ticketId, file) {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await httpClient.post(`/api/tickets/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

/** get all attachments for a ticket */
export async function listAttachments(ticketId) {
  const { data } = await httpClient.get(`/api/tickets/${ticketId}/attachments`);
  return data;
}

/** delete an attachment from a ticket */
export async function deleteAttachment(ticketId, attachmentId) {
  await httpClient.delete(`/api/tickets/${ticketId}/attachments/${attachmentId}`);
}
