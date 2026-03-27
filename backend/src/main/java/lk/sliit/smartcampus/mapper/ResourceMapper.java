package lk.sliit.smartcampus.mapper;

import java.util.Collections;
import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;
import lk.sliit.smartcampus.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class ResourceMapper {

  public Resource toNewEntity(ResourceCreateRequest request) {
    return Resource.builder()
        .resourceCode(request.getResourceCode().trim())
        .resourceName(request.getResourceName().trim())
        .resourceType(request.getResourceType())
        .capacity(request.getCapacity())
        .building(request.getBuilding())
        .floor(request.getFloor())
        .roomOrAreaIdentifier(request.getRoomOrAreaIdentifier())
        .fullLocationDescription(request.getFullLocationDescription())
        .defaultAvailableFrom(request.getDefaultAvailableFrom())
        .defaultAvailableTo(request.getDefaultAvailableTo())
        .workingDays(request.getWorkingDays())
        .status(request.getStatus())
        .statusNotes(request.getStatusNotes())
        .description(request.getDescription())
        .isActive(request.getIsActive())
        .build();
  }

  public void apply(Resource entity, ResourceUpdateRequest request) {
    entity.setResourceCode(request.getResourceCode().trim());
    entity.setResourceName(request.getResourceName().trim());
    entity.setResourceType(request.getResourceType());
    entity.setCapacity(request.getCapacity());
    entity.setBuilding(request.getBuilding());
    entity.setFloor(request.getFloor());
    entity.setRoomOrAreaIdentifier(request.getRoomOrAreaIdentifier());
    entity.setFullLocationDescription(request.getFullLocationDescription());
    entity.setDefaultAvailableFrom(request.getDefaultAvailableFrom());
    entity.setDefaultAvailableTo(request.getDefaultAvailableTo());
    entity.setWorkingDays(request.getWorkingDays());
    entity.setStatus(request.getStatus());
    entity.setStatusNotes(request.getStatusNotes());
    entity.setDescription(request.getDescription());
    entity.setIsActive(request.getIsActive());
  }

  public ResourceResponse toResponse(Resource entity) {
    return toResponse(entity, Collections.emptyList());
  }

  public ResourceResponse toResponse(Resource entity, List<ResourceTagResponse> tags) {
    return toResponse(entity, tags, null, null, null);
  }

  public ResourceResponse toResponse(
      Resource entity,
      List<ResourceTagResponse> tags,
      String smartAvailabilityStatus,
      String nextBookingTime,
      Integer todayBookingCount) {
    List<ResourceTagResponse> safeTags = tags == null ? Collections.emptyList() : tags;
    return ResourceResponse.builder()
        .resourceId(entity.getResourceId())
        .resourceCode(entity.getResourceCode())
        .resourceName(entity.getResourceName())
        .resourceType(entity.getResourceType())
        .capacity(entity.getCapacity())
        .building(entity.getBuilding())
        .floor(entity.getFloor())
        .roomOrAreaIdentifier(entity.getRoomOrAreaIdentifier())
        .fullLocationDescription(entity.getFullLocationDescription())
        .defaultAvailableFrom(entity.getDefaultAvailableFrom())
        .defaultAvailableTo(entity.getDefaultAvailableTo())
        .workingDays(entity.getWorkingDays())
        .status(entity.getStatus())
        .statusNotes(entity.getStatusNotes())
        .description(entity.getDescription())
        .isActive(entity.getIsActive())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .smartAvailabilityStatus(smartAvailabilityStatus)
        .nextBookingTime(nextBookingTime)
        .todayBookingCount(todayBookingCount)
        .tags(safeTags)
        .build();
  }
}
