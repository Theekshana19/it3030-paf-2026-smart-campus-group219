package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.ResourceTagMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceTagMappingRepository extends JpaRepository<ResourceTagMapping, Long> {

  boolean existsByResource_ResourceIdAndTag_TagId(Long resourceId, Long tagId);

  void deleteByResource_ResourceIdAndTag_TagId(Long resourceId, Long tagId);

  List<ResourceTagMapping> findByResource_ResourceId(Long resourceId);

  List<ResourceTagMapping> findByTag_TagId(Long tagId);
}
