import httpClient from '../../../services/httpClient.js';

export async function listTags() {
  const { data } = await httpClient.get('/api/resource-tags');
  return data;
}

/**
 * @param {{ tagName: string; tagColor?: string; description?: string; isActive: boolean }} payload
 */
export async function createTag(payload) {
  const { data } = await httpClient.post('/api/resource-tags', payload);
  return data;
}

export async function addTagToResource(resourceId, tagId) {
  await httpClient.post(`/api/resources/${resourceId}/tags/${tagId}`);
}

/**
 * @param {number|string} resourceId
 * @param {number|string} tagId
 */
export async function removeTagFromResource(resourceId, tagId) {
  await httpClient.delete(`/api/resources/${resourceId}/tags/${tagId}`);
}
