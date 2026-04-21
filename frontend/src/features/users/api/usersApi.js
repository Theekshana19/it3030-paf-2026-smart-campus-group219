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

/**
 * Same as PATCH; use when you want explicit PUT semantics for role replacement.
 * @param {number|string} userId
 * @param {'USER'|'ADMIN'|'TECHNICIAN'} role
 */
export async function putUserRole(userId, role) {
  const { data } = await httpClient.put(`/api/users/${userId}/role`, { role });
  return data;
}
