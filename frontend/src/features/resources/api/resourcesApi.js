import httpClient from '../../../services/httpClient.js';

/**
 * @param {import('../types/resource.types.js').ResourceCreatePayload} payload
 */
export async function createResource(payload) {
  const { data } = await httpClient.post('/api/resources', payload);
  return data;
}
