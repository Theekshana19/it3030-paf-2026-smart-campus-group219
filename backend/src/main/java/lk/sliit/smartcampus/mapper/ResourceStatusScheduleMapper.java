package lk.sliit.smartcampus.mapper;

import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleCreateRequest;
import lk.sliit.smartcampus.dto.response.ResourceStatusScheduleResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import org.springframework.stereotype.Component;

@Component
public class ResourceStatusScheduleMapper {

  public ResourceStatusSchedule toNewEntity(
      Resource resource, ResourceStatusScheduleCreateRequest request) {
    return ResourceStatusSchedule.builder()
        .resource(resource)
        .scheduleDate(request.getScheduleDate())
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .scheduledStatus(request.getScheduledStatus())
        .reasonNote(request.getReasonNote())
        .isActive(request.getIsActive())
        .build();
  }

  public void apply(
      ResourceStatusSchedule entity, ResourceStatusScheduleCreateRequest request) {
    entity.setScheduleDate(request.getScheduleDate());
    entity.setStartTime(request.getStartTime());
    entity.setEndTime(request.getEndTime());
    entity.setScheduledStatus(request.getScheduledStatus());
    entity.setReasonNote(request.getReasonNote());
    entity.setIsActive(request.getIsActive());
  }

  public ResourceStatusScheduleResponse toResponse(ResourceStatusSchedule entity) {
    Long resourceId =
        entity.getResource() != null ? entity.getResource().getResourceId() : null;
    return ResourceStatusScheduleResponse.builder()
        .scheduleId(entity.getScheduleId())
        .resourceId(resourceId)
        .scheduleDate(entity.getScheduleDate())
        .startTime(entity.getStartTime())
        .endTime(entity.getEndTime())
        .scheduledStatus(entity.getScheduledStatus())
        .reasonNote(entity.getReasonNote())
        .isActive(entity.getIsActive())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
