import httpClient from '../../../services/httpClient.js';

/**
 * @param {{ googleToken: string }} payload
 */
export async function loginWithGoogle(payload) {
  const { data } = await httpClient.post('/api/auth/google', payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await httpClient.get('/api/auth/me');
  return data;
}
