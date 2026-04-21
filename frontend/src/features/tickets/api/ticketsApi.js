import httpClient from '../../../services/httpClient.js';

/**
 * @param {{ title: string, description?: string }} payload
 */
export async function createTicket(payload) {
  const { data } = await httpClient.post('/api/tickets', payload);
  return data;
}

export async function getMyTickets() {
  const { data } = await httpClient.get('/api/tickets/mine');
  return data;
}

/**
 * @param {number|string} ticketId
 */
export async function getTicket(ticketId) {
  const { data } = await httpClient.get(`/api/tickets/${ticketId}`);
  return data;
}

/**
 * @param {number|string} ticketId
 * @param {{ status: string }} payload
 */
export async function updateTicketStatus(ticketId, payload) {
  const { data } = await httpClient.patch(`/api/tickets/${ticketId}/status`, payload);
  return data;
}

/**
 * @param {number|string} ticketId
 * @param {{ body: string }} payload
 */
export async function addTicketComment(ticketId, payload) {
  const { data } = await httpClient.post(`/api/tickets/${ticketId}/comments`, payload);
  return data;
}
