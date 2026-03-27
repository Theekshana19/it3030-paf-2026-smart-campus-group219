package lk.sliit.smartcampus.mapper;

import lk.sliit.smartcampus.dto.request.ResourceTagCreateRequest;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;
import lk.sliit.smartcampus.entity.ResourceTag;
import org.springframework.stereotype.Component;

@Component
public class ResourceTagMapper {

  public ResourceTag toNewEntity(ResourceTagCreateRequest request) {
    return ResourceTag.builder()
        .tagName(request.getTagName().trim())
        .tagColor(request.getTagColor())
        .description(request.getDescription())
        .isActive(request.getIsActive())
        .build();
  }

  public void apply(ResourceTag entity, ResourceTagCreateRequest request) {
    entity.setTagName(request.getTagName().trim());
    entity.setTagColor(request.getTagColor());
    entity.setDescription(request.getDescription());
    entity.setIsActive(request.getIsActive());
  }

  public ResourceTagResponse toResponse(ResourceTag entity) {
    return ResourceTagResponse.builder()
        .tagId(entity.getTagId())
        .tagName(entity.getTagName())
        .tagColor(entity.getTagColor())
        .description(entity.getDescription())
        .isActive(entity.getIsActive())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
