import httpClient from '../../../services/httpClient.js';

/**
 * @param {{ googleToken: string }} payload
 */
export async function loginWithGoogle(payload) {
  const { data } = await httpClient.post('/api/auth/google', payload);
  return data;
}

/**
 * @param {string} googleToken
 */
export async function getCurrentUser(googleToken) {
  const { data } = await httpClient.get('/api/auth/me', {
    params: { googleToken },
  });
  return data;
}
