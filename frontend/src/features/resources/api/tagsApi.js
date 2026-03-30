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
