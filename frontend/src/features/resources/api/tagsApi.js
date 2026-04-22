/**
 * Tag HTTP API — re-exports from the tags feature module for backwards compatibility
 * (Add Resource, Edit Resource, catalogue hooks).
 */
export {
  listTags,
  createTag,
  addTagToResource,
  removeTagFromResource,
  getTagOverview,
  updateTag,
  deleteTag,
  listUntaggedResources,
  bulkAssignTags,
} from '../../tags/api/tagService.js';
