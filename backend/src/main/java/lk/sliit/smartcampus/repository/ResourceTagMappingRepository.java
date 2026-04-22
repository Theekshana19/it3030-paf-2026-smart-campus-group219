package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.ResourceTagMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ResourceTagMappingRepository extends JpaRepository<ResourceTagMapping, Long> {

  boolean existsByResource_ResourceIdAndTag_TagId(Long resourceId, Long tagId);

  void deleteByResource_ResourceIdAndTag_TagId(Long resourceId, Long tagId);

  void deleteByResource_ResourceId(Long resourceId);

  List<ResourceTagMapping> findByResource_ResourceId(Long resourceId);

  List<ResourceTagMapping> findByTag_TagId(Long tagId);

  @Query(
      "select m.tag.tagId, count(m) from ResourceTagMapping m group by m.tag.tagId order by count(m) desc")
  List<Object[]> countMappingsByTagIdOrderByCountDesc();

  long countByTag_TagId(Long tagId);
}
