package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceTag;
import lk.sliit.smartcampus.entity.ResourceTagMapping;
import lk.sliit.smartcampus.exception.DuplicateTagMappingException;
import lk.sliit.smartcampus.exception.ResourceNotFoundException;
import lk.sliit.smartcampus.exception.TagNotFoundException;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.ResourceTagMappingRepository;
import lk.sliit.smartcampus.repository.ResourceTagRepository;
import lk.sliit.smartcampus.service.ResourceTagMappingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ResourceTagMappingServiceImpl implements ResourceTagMappingService {

  private final ResourceRepository resourceRepository;
  private final ResourceTagRepository resourceTagRepository;
  private final ResourceTagMappingRepository resourceTagMappingRepository;

  public ResourceTagMappingServiceImpl(
      ResourceRepository resourceRepository,
      ResourceTagRepository resourceTagRepository,
      ResourceTagMappingRepository resourceTagMappingRepository) {
    this.resourceRepository = resourceRepository;
    this.resourceTagRepository = resourceTagRepository;
    this.resourceTagMappingRepository = resourceTagMappingRepository;
  }

  @Override
  public void addTagToResource(Long resourceId, Long tagId) {
    Resource resource =
        resourceRepository.findById(resourceId).orElseThrow(() -> new ResourceNotFoundException(resourceId));
    ResourceTag tag =
        resourceTagRepository.findById(tagId).orElseThrow(() -> new TagNotFoundException(tagId));
    if (resourceTagMappingRepository.existsByResource_ResourceIdAndTag_TagId(resourceId, tagId)) {
      throw new DuplicateTagMappingException(resourceId, tagId);
    }
    ResourceTagMapping mapping =
        ResourceTagMapping.builder()
            .resource(resource)
            .tag(tag)
            .createdAt(LocalDateTime.now())
            .build();
    resourceTagMappingRepository.save(mapping);
  }

  @Override
  public void removeTagFromResource(Long resourceId, Long tagId) {
    if (!resourceRepository.existsById(resourceId)) {
      throw new ResourceNotFoundException(resourceId);
    }
    if (!resourceTagRepository.existsById(tagId)) {
      throw new TagNotFoundException(tagId);
    }
    if (!resourceTagMappingRepository.existsByResource_ResourceIdAndTag_TagId(resourceId, tagId)) {
      return;
    }
    resourceTagMappingRepository.deleteByResource_ResourceIdAndTag_TagId(resourceId, tagId);
  }
}
