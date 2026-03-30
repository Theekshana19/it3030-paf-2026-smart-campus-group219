import httpClient from '../../../services/httpClient.js';

/**
 * @param {Record<string, unknown>} raw
 * @returns {Record<string, string|number>}
 */
function buildListQuery(raw) {
  /** @type {Record<string, string|number>} */
  const out = {};
  const keys = [
    'type',
    'minCapacity',
    'building',
    'status',
    'tag',
    'search',
    'page',
    'size',
    'sortBy',
    'sortDir',
  ];
  for (const k of keys) {
    const v = raw[k];
    if (v === undefined || v === null || v === '') continue;
    out[k] = v;
  }
  return out;
}

/**
 * @param {import('../types/resource.types.js').ResourceListQuery} params
 * @returns {Promise<import('../types/resource.types.js').ResourceListResponse>}
 */
export async function listResources(params = {}) {
  const { data } = await httpClient.get('/api/resources', { params: buildListQuery(params) });
  return data;
}

/**
 * @param {import('../types/resource.types.js').ResourceCreatePayload} payload
 */
export async function createResource(payload) {
  const { data } = await httpClient.post('/api/resources', payload);
  return data;
}

/**
 * @param {number|string} id
 */
export async function deleteResource(id) {
  await httpClient.delete(`/api/resources/${id}`);
}
