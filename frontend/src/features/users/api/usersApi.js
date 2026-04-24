import httpClient from '../../../services/httpClient';

export const listUsers = () => httpClient.get('/api/users').then((r) => r.data);

export const updateUserRole = (userId, role) =>
  httpClient.patch(`/api/users/${userId}/role`, { role }).then((r) => r.data);
