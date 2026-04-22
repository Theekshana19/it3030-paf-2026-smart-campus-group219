package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lk.sliit.smartcampus.dto.request.ResourceTagBulkAssignRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceTagBulkAssignFailedItem;
import lk.sliit.smartcampus.dto.response.ResourceTagBulkAssignResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagOverviewResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;
import lk.sliit.smartcampus.dto.response.TagMostUsedItemResponse;
import lk.sliit.smartcampus.entity.ResourceTag;
import lk.sliit.smartcampus.exception.TagNotFoundException;
import lk.sliit.smartcampus.mapper.ResourceTagMapper;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.ResourceTagMappingRepository;
import lk.sliit.smartcampus.repository.ResourceTagRepository;
import lk.sliit.smartcampus.service.ResourceTagMappingService;
import lk.sliit.smartcampus.service.ResourceTagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceTagServiceImpl implements ResourceTagService {

  private static final int MOST_USED_LIMIT = 8;

  private final ResourceTagRepository resourceTagRepository;
  private final ResourceTagMappingRepository resourceTagMappingRepository;
  private final ResourceRepository resourceRepository;
  private final ResourceTagMapper resourceTagMapper;
  private final ResourceTagMappingService resourceTagMappingService;

  public ResourceTagServiceImpl(
      ResourceTagRepository resourceTagRepository,
      ResourceTagMappingRepository resourceTagMappingRepository,
      ResourceRepository resourceRepository,
      ResourceTagMapper resourceTagMapper,
      ResourceTagMappingService resourceTagMappingService) {
    this.resourceTagRepository = resourceTagRepository;
    this.resourceTagMappingRepository = resourceTagMappingRepository;
    this.resourceRepository = resourceRepository;
    this.resourceTagMapper = resourceTagMapper;
    this.resourceTagMappingService = resourceTagMappingService;
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceTagResponse> findAll() {
    Map<Long, Integer> usageByTagId = loadUsageCountsByTagId();
    return resourceTagRepository.findAll().stream()
        .map(t -> resourceTagMapper.toResponse(t, usageByTagId.getOrDefault(t.getTagId(), 0)))
        .toList();
  }

  private Map<Long, Integer> loadUsageCountsByTagId() {
    Map<Long, Integer> map = new HashMap<>();
    for (Object[] row : resourceTagMappingRepository.countMappingsByTagIdOrderByCountDesc()) {
      Long tagId = (Long) row[0];
      Number cnt = (Number) row[1];
      map.put(tagId, cnt.intValue());
    }
    return map;
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceTagOverviewResponse getOverview() {
    long totalActiveTags = resourceTagRepository.countByIsActiveTrue();
    long untaggedResourceCount = resourceRepository.countUntagged();

    List<TagMostUsedItemResponse> mostUsed = new ArrayList<>();
    List<Object[]> rows = resourceTagMappingRepository.countMappingsByTagIdOrderByCountDesc();
    int taken = 0;
    for (Object[] row : rows) {
      if (taken >= MOST_USED_LIMIT) {
        break;
      }
      Long tagId = (Long) row[0];
      long usage = ((Number) row[1]).longValue();
      ResourceTag tag =
          resourceTagRepository.findById(tagId).orElse(null);
      if (tag == null) {
        continue;
      }
      mostUsed.add(
          TagMostUsedItemResponse.builder()
              .tagId(tag.getTagId())
              .tagName(tag.getTagName())
              .tagColor(tag.getTagColor())
              .usageCount(usage)
              .build());
      taken++;
    }

    return ResourceTagOverviewResponse.builder()
        .mostUsedTags(mostUsed)
        .untaggedResourceCount(untaggedResourceCount)
        .totalActiveTags(totalActiveTags)
        .build();
  }

  @Override
  public ResourceTagBulkAssignResponse bulkAssign(ResourceTagBulkAssignRequest request) {
    List<Long> resourceIds = distinctLongs(request.getResourceIds());
    List<Long> tagIds = distinctLongs(request.getTagIds());
    int mappingsCreated = 0;
    int duplicatesSkipped = 0;
    List<ResourceTagBulkAssignFailedItem> failed = new ArrayList<>();

    for (Long resourceId : resourceIds) {
      if (!resourceRepository.existsById(resourceId)) {
        for (Long tagId : tagIds) {
          failed.add(
              ResourceTagBulkAssignFailedItem.builder()
                  .resourceId(resourceId)
                  .tagId(tagId)
                  .reason("Resource not found")
                  .build());
        }
        continue;
      }
      for (Long tagId : tagIds) {
        if (!resourceTagRepository.existsById(tagId)) {
          failed.add(
              ResourceTagBulkAssignFailedItem.builder()
                  .resourceId(resourceId)
                  .tagId(tagId)
                  .reason("Tag not found")
                  .build());
          continue;
        }
        if (resourceTagMappingRepository.existsByResource_ResourceIdAndTag_TagId(resourceId, tagId)) {
          duplicatesSkipped++;
          continue;
        }
        try {
          resourceTagMappingService.addTagToResource(resourceId, tagId);
          mappingsCreated++;
        } catch (RuntimeException ex) {
          failed.add(
              ResourceTagBulkAssignFailedItem.builder()
                  .resourceId(resourceId)
                  .tagId(tagId)
                  .reason(ex.getMessage() != null ? ex.getMessage() : "Assign failed")
                  .build());
        }
      }
    }

    List<String> messages = new ArrayList<>();
    messages.add(
        String.format(
            "Bulk assign complete: %d mapping(s) created, %d duplicate(s) skipped.",
            mappingsCreated, duplicatesSkipped));

    return ResourceTagBulkAssignResponse.builder()
        .totalResourceIds(resourceIds.size())
        .totalTagIds(tagIds.size())
        .mappingsCreated(mappingsCreated)
        .duplicatesSkipped(duplicatesSkipped)
        .failed(failed)
        .messages(messages)
        .build();
  }

  private static List<Long> distinctLongs(List<Long> ids) {
    Set<Long> set = new LinkedHashSet<>();
    for (Long id : ids) {
      if (id != null) {
        set.add(id);
      }
    }
    return new ArrayList<>(set);
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceTagResponse getById(Long tagId) {
    ResourceTag entity =
        resourceTagRepository.findById(tagId).orElseThrow(() -> new TagNotFoundException(tagId));
    int usage = (int) resourceTagMappingRepository.countByTag_TagId(tagId);
    return resourceTagMapper.toResponse(entity, usage);
  }

  @Override
  public ResourceTagResponse create(ResourceTagCreateRequest request) {
    if (resourceTagRepository.existsByTagNameIgnoreCase(request.getTagName())) {
      throw new IllegalArgumentException("Tag name already exists: " + request.getTagName());
    }
    ResourceTag entity = resourceTagMapper.toNewEntity(request);
    LocalDateTime now = LocalDateTime.now();
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);
    ResourceTag saved = resourceTagRepository.save(entity);
    return resourceTagMapper.toResponse(saved, 0);
  }

  @Override
  public ResourceTagResponse update(Long tagId, ResourceTagUpdateRequest request) {
    ResourceTag entity =
        resourceTagRepository.findById(tagId).orElseThrow(() -> new TagNotFoundException(tagId));
    if (!entity.getTagName().equalsIgnoreCase(request.getTagName())
        && resourceTagRepository.existsByTagNameIgnoreCase(request.getTagName())) {
      throw new IllegalArgumentException("Tag name already exists: " + request.getTagName());
    }
    resourceTagMapper.apply(entity, request);
    entity.setUpdatedAt(LocalDateTime.now());
    ResourceTag saved = resourceTagRepository.save(entity);
    int usage = (int) resourceTagMappingRepository.countByTag_TagId(tagId);
    return resourceTagMapper.toResponse(saved, usage);
  }

  @Override
  public void delete(Long tagId) {
    if (!resourceTagRepository.existsById(tagId)) {
      throw new TagNotFoundException(tagId);
    }
    resourceTagRepository.deleteById(tagId);
  }
}
