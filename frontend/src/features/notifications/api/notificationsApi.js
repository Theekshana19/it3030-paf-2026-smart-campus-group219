import httpClient from '../../../services/httpClient.js';

export async function getNotifications() {
  const { data } = await httpClient.get('/api/notifications');
  return data;
}

/**
 * @param {number|string} notificationId
 */
export async function markNotificationAsRead(notificationId) {
  await httpClient.patch(`/api/notifications/${notificationId}/read`);
}

export async function markAllNotificationsAsRead() {
  await httpClient.patch('/api/notifications/read-all');
}

/**
 * @param {number|string} notificationId
 */
export async function deleteNotification(notificationId) {
  await httpClient.delete(`/api/notifications/${notificationId}`);
}
