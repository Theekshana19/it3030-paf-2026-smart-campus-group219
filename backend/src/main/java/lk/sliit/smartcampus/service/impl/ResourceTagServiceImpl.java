package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceTagCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;
import lk.sliit.smartcampus.entity.ResourceTag;
import lk.sliit.smartcampus.exception.TagNotFoundException;
import lk.sliit.smartcampus.mapper.ResourceTagMapper;
import lk.sliit.smartcampus.repository.ResourceTagRepository;
import lk.sliit.smartcampus.service.ResourceTagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceTagServiceImpl implements ResourceTagService {

  private final ResourceTagRepository resourceTagRepository;
  private final ResourceTagMapper resourceTagMapper;

  public ResourceTagServiceImpl(
      ResourceTagRepository resourceTagRepository, ResourceTagMapper resourceTagMapper) {
    this.resourceTagRepository = resourceTagRepository;
    this.resourceTagMapper = resourceTagMapper;
  }

  @Override
  @Transactional(readOnly = true)
  public List<ResourceTagResponse> findAll() {
    return resourceTagRepository.findAll().stream().map(resourceTagMapper::toResponse).toList();
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
    return resourceTagMapper.toResponse(saved);
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
    return resourceTagMapper.toResponse(saved);
  }

  @Override
  public void delete(Long tagId) {
    if (!resourceTagRepository.existsById(tagId)) {
      throw new TagNotFoundException(tagId);
    }
    resourceTagRepository.deleteById(tagId);
  }
}
