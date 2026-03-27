package lk.sliit.smartcampus.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import org.springframework.util.StringUtils;
import lk.sliit.smartcampus.dto.request.ResourceCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceListResponse;
import lk.sliit.smartcampus.dto.response.ResourceResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.entity.ResourceTagMapping;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.exception.DuplicateResourceCodeException;
import lk.sliit.smartcampus.exception.ResourceNotFoundException;
import lk.sliit.smartcampus.mapper.ResourceMapper;
import lk.sliit.smartcampus.mapper.ResourceTagMapper;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.ResourceStatusScheduleRepository;
import lk.sliit.smartcampus.repository.ResourceTagMappingRepository;
import lk.sliit.smartcampus.service.ResourceService;
import lk.sliit.smartcampus.service.SmartAvailabilityService;
import lk.sliit.smartcampus.service.SmartAvailabilitySnapshot;
import lk.sliit.smartcampus.util.ResourceSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceServiceImpl implements ResourceService {

  private static final Set<String> ALLOWED_SORT_FIELDS =
      Set.of(
          "resourceId",
          "resourceCode",
          "resourceName",
          "resourceType",
          "building",
          "floor",
          "capacity",
          "status",
          "createdAt",
          "updatedAt");

  private final ResourceRepository resourceRepository;
  private final ResourceTagMappingRepository resourceTagMappingRepository;
  private final ResourceStatusScheduleRepository resourceStatusScheduleRepository;
  private final ResourceMapper resourceMapper;
  private final ResourceTagMapper resourceTagMapper;
  private final SmartAvailabilityService smartAvailabilityService;

  public ResourceServiceImpl(
      ResourceRepository resourceRepository,
      ResourceTagMappingRepository resourceTagMappingRepository,
      ResourceStatusScheduleRepository resourceStatusScheduleRepository,
      ResourceMapper resourceMapper,
      ResourceTagMapper resourceTagMapper,
      SmartAvailabilityService smartAvailabilityService) {
    this.resourceRepository = resourceRepository;
    this.resourceTagMappingRepository = resourceTagMappingRepository;
    this.resourceStatusScheduleRepository = resourceStatusScheduleRepository;
    this.resourceMapper = resourceMapper;
    this.resourceTagMapper = resourceTagMapper;
    this.smartAvailabilityService = smartAvailabilityService;
  }

  @Override
  public ResourceResponse create(ResourceCreateRequest request) {
    if (resourceRepository.existsByResourceCodeIgnoreCase(request.getResourceCode())) {
      throw new DuplicateResourceCodeException(request.getResourceCode());
    }
    Resource entity = resourceMapper.toNewEntity(request);
    LocalDateTime now = LocalDateTime.now();
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);
    Resource saved = resourceRepository.save(entity);
    return mapToResponse(saved);
  }

  @Override
  public ResourceResponse update(Long resourceId, ResourceUpdateRequest request) {
    Resource entity = loadResource(resourceId);
    if (!entity.getResourceCode().equalsIgnoreCase(request.getResourceCode())
        && resourceRepository.existsByResourceCodeIgnoreCase(request.getResourceCode())) {
      throw new DuplicateResourceCodeException(request.getResourceCode());
    }
    resourceMapper.apply(entity, request);
    entity.setUpdatedAt(LocalDateTime.now());
    Resource saved = resourceRepository.save(entity);
    return mapToResponse(saved);
  }

  @Override
  public void delete(Long resourceId) {
    if (!resourceRepository.existsById(resourceId)) {
      throw new ResourceNotFoundException(resourceId);
    }
    resourceTagMappingRepository.deleteByResource_ResourceId(resourceId);
    resourceStatusScheduleRepository.deleteByResource_ResourceId(resourceId);
    resourceRepository.deleteById(resourceId);
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceResponse getById(Long resourceId) {
    return mapToResponse(loadResource(resourceId));
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceListResponse findAll(
      ResourceType type,
      Integer minCapacity,
      String building,
      ResourceStatus status,
      String tag,
      String search,
      Integer page,
      Integer size,
      String sortBy,
      String sortDir) {

    Specification<Resource> spec =
        ResourceSpecifications.filter(type, minCapacity, building, status, tag, search);
    if (!StringUtils.hasText(sortBy) || !ALLOWED_SORT_FIELDS.contains(sortBy)) {
      throw new IllegalArgumentException(
          "sortBy must be one of: " + String.join(", ", ALLOWED_SORT_FIELDS));
    }
    Sort sort =
        "desc".equalsIgnoreCase(sortDir)
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);
    Page<Resource> resourcePage = resourceRepository.findAll(spec, pageable);
    List<ResourceResponse> items = resourcePage.getContent().stream().map(this::mapToResponse).toList();
    return ResourceListResponse.builder()
        .items(items)
        .totalItems(resourcePage.getTotalElements())
        .page(resourcePage.getNumber())
        .size(resourcePage.getSize())
        .totalPages(resourcePage.getTotalPages())
        .build();
  }

  private Resource loadResource(Long id) {
    return resourceRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
  }

  private ResourceResponse mapToResponse(Resource resource) {
    List<ResourceTagResponse> tags = loadTags(resource.getResourceId());
    LocalDate today = LocalDate.now();
    List<ResourceStatusSchedule> todaySchedules =
        resourceStatusScheduleRepository.findByResource_ResourceIdAndScheduleDate(
            resource.getResourceId(), today);
    SmartAvailabilitySnapshot snap = smartAvailabilityService.compute(resource, todaySchedules);
    return resourceMapper.toResponse(
        resource,
        tags,
        snap.smartAvailabilityStatus(),
        snap.nextBookingTime(),
        snap.todayBookingCount());
  }

  private List<ResourceTagResponse> loadTags(Long resourceId) {
    return resourceTagMappingRepository.findByResource_ResourceId(resourceId).stream()
        .map(ResourceTagMapping::getTag)
        .map(resourceTagMapper::toResponse)
        .toList();
  }
}
