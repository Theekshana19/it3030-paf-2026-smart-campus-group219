import httpClient from '../../../services/httpClient.js';

/**
 * @param {string} googleToken
 */
export async function getNotifications(googleToken) {
  const { data } = await httpClient.get('/api/notifications', {
    params: { googleToken },
  });
  return data;
}

/**
 * @param {number|string} notificationId
 * @param {string} googleToken
 */
export async function markNotificationAsRead(notificationId, googleToken) {
  await httpClient.patch(`/api/notifications/${notificationId}/read`, null, {
    params: { googleToken },
  });
}

/**
 * @param {string} googleToken
 */
export async function markAllNotificationsAsRead(googleToken) {
  await httpClient.patch('/api/notifications/read-all', null, {
    params: { googleToken },
  });
}
