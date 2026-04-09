import httpClient from '../../../services/httpClient.js';

/** get all active comments for a ticket */
export async function listComments(ticketId) {
  const { data } = await httpClient.get(`/api/tickets/${ticketId}/comments`);
  return data;
}

/** add a new comment to a ticket */
export async function addComment(ticketId, payload) {
  const { data } = await httpClient.post(`/api/tickets/${ticketId}/comments`, payload);
  return data;
}

/** edit an existing comment (only the author can do this) */
export async function updateComment(ticketId, commentId, authorEmail, newText) {
  const { data } = await httpClient.put(
    `/api/tickets/${ticketId}/comments/${commentId}?authorEmail=${encodeURIComponent(authorEmail)}`,
    newText,
    { headers: { 'Content-Type': 'text/plain' } }
  );
  return data;
}

/** delete a comment (only the author or admin can do this) */
export async function deleteComment(ticketId, commentId, requesterEmail) {
  await httpClient.delete(
    `/api/tickets/${ticketId}/comments/${commentId}?requesterEmail=${encodeURIComponent(requesterEmail)}`
  );
}
