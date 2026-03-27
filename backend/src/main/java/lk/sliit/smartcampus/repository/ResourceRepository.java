package lk.sliit.smartcampus.repository;

import java.util.List;
import java.util.Optional;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ResourceRepository
    extends JpaRepository<Resource, Long>, JpaSpecificationExecutor<Resource> {

  boolean existsByResourceCodeIgnoreCase(String resourceCode);

  Optional<Resource> findByResourceCodeIgnoreCase(String resourceCode);

  List<Resource> findByResourceType(ResourceType resourceType);

  List<Resource> findByBuildingIgnoreCase(String building);

  List<Resource> findByStatus(ResourceStatus status);

  List<Resource> findByCapacityGreaterThanEqual(Integer minCapacity);
}
