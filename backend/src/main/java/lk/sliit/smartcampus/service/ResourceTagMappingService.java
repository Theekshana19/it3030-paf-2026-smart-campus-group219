package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;

public interface ResourceTagMappingService {

  List<ResourceTagResponse> findTagsByResource(Long resourceId);

  void addTagToResource(Long resourceId, Long tagId);

  void removeTagFromResource(Long resourceId, Long tagId);
}
