package lk.sliit.smartcampus.service;

import lk.sliit.smartcampus.dto.request.ResourceCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceListResponse;
import lk.sliit.smartcampus.dto.response.ResourceResponse;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;

public interface ResourceService {

  ResourceResponse create(ResourceCreateRequest request);

  ResourceResponse update(Long resourceId, ResourceUpdateRequest request);

  void delete(Long resourceId);

  ResourceResponse getById(Long resourceId);

  ResourceListResponse findAll(
      ResourceType type,
      Integer minCapacity,
      String building,
      ResourceStatus status,
      String tag,
      String search,
      Integer page,
      Integer size,
      String sortBy,
      String sortDir);
}
