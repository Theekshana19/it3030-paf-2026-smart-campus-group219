package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceStatusScheduleResponse;

public interface ResourceStatusScheduleService {

  ResourceStatusScheduleResponse create(
      Long resourceId, ResourceStatusScheduleCreateRequest request);

  List<ResourceStatusScheduleResponse> findByResource(Long resourceId);

  ResourceStatusScheduleResponse update(
      Long resourceId, Long scheduleId, ResourceStatusScheduleUpdateRequest request);

  void delete(Long resourceId, Long scheduleId);
}
