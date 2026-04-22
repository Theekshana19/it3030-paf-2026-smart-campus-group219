import httpClient from '../../../services/httpClient.js';

const TAGS_BASE = '/api/resource-tags';

export async function listTags() {
  const { data } = await httpClient.get(TAGS_BASE);
  return data;
}

export async function getTagOverview() {
  const { data } = await httpClient.get(`${TAGS_BASE}/overview`);
  return data;
}

/**
 * @param {{ tagName: string; tagColor?: string; description?: string; isActive?: boolean }} payload
 */
export async function createTag(payload) {
  const { data } = await httpClient.post(TAGS_BASE, {
    tagName: payload.tagName?.trim(),
    tagColor: payload.tagColor || undefined,
    description: payload.description?.trim() || undefined,
    isActive: payload.isActive !== false,
  });
  return data;
}

/**
 * @param {number|string} tagId
 * @param {{ tagName: string; tagColor?: string; description?: string; isActive: boolean }} payload
 */
export async function updateTag(tagId, payload) {
  const { data } = await httpClient.put(`${TAGS_BASE}/${tagId}`, {
    tagName: payload.tagName?.trim(),
    tagColor: payload.tagColor || undefined,
    description: payload.description?.trim() || undefined,
    isActive: payload.isActive,
  });
  return data;
}

export async function deleteTag(tagId) {
  await httpClient.delete(`${TAGS_BASE}/${tagId}`);
}

/**
 * @param {{ search?: string; page?: number; size?: number; sortBy?: string; sortDir?: string }} params
 */
export async function listUntaggedResources(params = {}) {
  const { data } = await httpClient.get('/api/resources/untagged', { params });
  return data;
}

/**
 * @param {{ resourceIds: number[]; tagIds: number[] }} body
 */
export async function bulkAssignTags(body) {
  const { data } = await httpClient.post(`${TAGS_BASE}/bulk-assign`, body);
  return data;
}

export async function addTagToResource(resourceId, tagId) {
  await httpClient.post(`/api/resources/${resourceId}/tags/${tagId}`);
}

export async function removeTagFromResource(resourceId, tagId) {
  await httpClient.delete(`/api/resources/${resourceId}/tags/${tagId}`);
}
