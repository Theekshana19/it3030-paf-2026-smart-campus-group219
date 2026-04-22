package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceTagBulkAssignRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceTagBulkAssignResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagOverviewResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;

public interface ResourceTagService {

  List<ResourceTagResponse> findAll();

  ResourceTagOverviewResponse getOverview();

  ResourceTagBulkAssignResponse bulkAssign(ResourceTagBulkAssignRequest request);

  ResourceTagResponse getById(Long tagId);

  ResourceTagResponse create(ResourceTagCreateRequest request);

  ResourceTagResponse update(Long tagId, ResourceTagUpdateRequest request);

  void delete(Long tagId);
}
