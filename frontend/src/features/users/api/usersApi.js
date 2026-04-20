import httpClient from '../../../services/httpClient.js';

export async function getUsers() {
  const { data } = await httpClient.get('/api/users');
  return data;
}

/**
 * @param {number|string} userId
 * @param {'USER'|'ADMIN'|'TECHNICIAN'} role
 */
export async function updateUserRole(userId, role) {
  const { data } = await httpClient.patch(`/api/users/${userId}/role`, { role });
  return data;
}
