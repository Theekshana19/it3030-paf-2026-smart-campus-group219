package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceStatusScheduleResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.exception.ResourceNotFoundException;
import lk.sliit.smartcampus.exception.ScheduleNotFoundException;
import lk.sliit.smartcampus.mapper.ResourceStatusScheduleMapper;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.ResourceStatusScheduleRepository;
import lk.sliit.smartcampus.service.ResourceStatusScheduleService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceStatusScheduleServiceImpl implements ResourceStatusScheduleService {

  private final ResourceRepository resourceRepository;
  private final ResourceStatusScheduleRepository resourceStatusScheduleRepository;
  private final ResourceStatusScheduleMapper resourceStatusScheduleMapper;

  public ResourceStatusScheduleServiceImpl(
      ResourceRepository resourceRepository,
      ResourceStatusScheduleRepository resourceStatusScheduleRepository,
      ResourceStatusScheduleMapper resourceStatusScheduleMapper) {
    this.resourceRepository = resourceRepository;
    this.resourceStatusScheduleRepository = resourceStatusScheduleRepository;
    this.resourceStatusScheduleMapper = resourceStatusScheduleMapper;
  }

  @Override
  public ResourceStatusScheduleResponse create(
      Long resourceId, ResourceStatusScheduleCreateRequest request) {
    Resource resource =
        resourceRepository.findById(resourceId).orElseThrow(() -> new ResourceNotFoundException(resourceId));
    ResourceStatusSchedule entity = resourceStatusScheduleMapper.toNewEntity(resource, request);
    LocalDateTime now = LocalDateTime.now();
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);
    ResourceStatusSchedule saved = resourceStatusScheduleRepository.save(entity);
    return resourceStatusScheduleMapper.toResponse(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceStatusScheduleResponse> findByResource(Long resourceId) {
    if (!resourceRepository.existsById(resourceId)) {
      throw new ResourceNotFoundException(resourceId);
    }
    return resourceStatusScheduleRepository
        .findByResource_ResourceIdOrderByScheduleDateAscStartTimeAsc(resourceId)
        .stream()
        .map(resourceStatusScheduleMapper::toResponse)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public ResourceStatusScheduleResponse getById(Long resourceId, Long scheduleId) {
    ResourceStatusSchedule entity = loadSchedule(resourceId, scheduleId);
    return resourceStatusScheduleMapper.toResponse(entity);
  }

  @Override
  public ResourceStatusScheduleResponse update(
      Long resourceId, Long scheduleId, ResourceStatusScheduleUpdateRequest request) {
    ResourceStatusSchedule entity = loadSchedule(resourceId, scheduleId);
    resourceStatusScheduleMapper.apply(entity, request);
    entity.setUpdatedAt(LocalDateTime.now());
    ResourceStatusSchedule saved = resourceStatusScheduleRepository.save(entity);
    return resourceStatusScheduleMapper.toResponse(saved);
  }

  @Override
  public void delete(Long resourceId, Long scheduleId) {
    ResourceStatusSchedule entity = loadSchedule(resourceId, scheduleId);
    resourceStatusScheduleRepository.delete(entity);
  }

  private ResourceStatusSchedule loadSchedule(Long resourceId, Long scheduleId) {
    ResourceStatusSchedule entity =
        resourceStatusScheduleRepository
            .findById(scheduleId)
            .orElseThrow(() -> new ScheduleNotFoundException(scheduleId));
    if (entity.getResource() == null
        || !resourceId.equals(entity.getResource().getResourceId())) {
      throw new ScheduleNotFoundException(scheduleId);
    }
    return entity;
  }
}
