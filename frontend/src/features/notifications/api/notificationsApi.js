import httpClient from '../../../services/httpClient';

export const listNotifications = () =>
  httpClient.get('/api/notifications').then((r) => r.data);

export const getUnreadCount = () =>
  httpClient.get('/api/notifications/count').then((r) => r.data);

export const markAsRead = (id) =>
  httpClient.patch(`/api/notifications/${id}/read`).then((r) => r.data);

export const markAllAsRead = () =>
  httpClient.patch('/api/notifications/read-all').then((r) => r.data);
