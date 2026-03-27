package lk.sliit.smartcampus.repository;

import java.util.Optional;
import lk.sliit.smartcampus.entity.ResourceTag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceTagRepository extends JpaRepository<ResourceTag, Long> {

  boolean existsByTagNameIgnoreCase(String tagName);

  Optional<ResourceTag> findByTagNameIgnoreCase(String tagName);
}
