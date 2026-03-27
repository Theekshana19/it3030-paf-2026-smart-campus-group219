package lk.sliit.smartcampus.service;

public interface ResourceTagMappingService {

  void addTagToResource(Long resourceId, Long tagId);

  void removeTagFromResource(Long resourceId, Long tagId);
}
