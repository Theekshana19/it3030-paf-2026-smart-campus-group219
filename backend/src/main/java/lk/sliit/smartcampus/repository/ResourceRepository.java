package lk.sliit.smartcampus.repository;

import java.util.List;
import java.util.Optional;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResourceRepository
    extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {

  boolean existsByResourceCodeIgnoreCase(String resourceCode);

  Optional<Resource> findByResourceCodeIgnoreCase(String resourceCode);

  List<Resource> findByResourceType(ResourceType resourceType);

  List<Resource> findByBuildingIgnoreCase(String building);

  List<Resource> findByStatus(ResourceStatus status);

  List<Resource> findByCapacityGreaterThanEqual(Integer minCapacity);

  @Query(
      """
      select r from Resource r
      where not exists (select 1 from ResourceTagMapping m where m.resource.resourceId = r.resourceId)
      and (
        :search = ''
        or lower(r.resourceName) like lower(concat('%', :search, '%'))
        or lower(r.resourceCode) like lower(concat('%', :search, '%'))
        or lower(coalesce(r.building, '')) like lower(concat('%', :search, '%'))
      )
      """)
  Page<Resource> findUntagged(@Param("search") String search, Pageable pageable);

  @Query(
      """
      select count(r) from Resource r
      where not exists (select 1 from ResourceTagMapping m where m.resource.resourceId = r.resourceId)
      """)
  long countUntagged();
}
