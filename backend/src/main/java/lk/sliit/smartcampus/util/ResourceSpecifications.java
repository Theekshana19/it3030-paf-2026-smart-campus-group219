package lk.sliit.smartcampus.util;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import java.util.ArrayList;
import java.util.List;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceTag;
import lk.sliit.smartcampus.entity.ResourceTagMapping;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import org.springframework.data.jpa.domain.Specification;

public final class ResourceSpecifications {

  private ResourceSpecifications() {}

  public static Specification<Resource> filter(
      ResourceType type,
      Integer minCapacity,
      String building,
      ResourceStatus status,
      String tag,
      String search) {

    return (root, query, cb) -> {
      if (query != null && Resource.class.equals(query.getResultType())) {
        query.distinct(true);
      }
      List<Predicate> predicates = new ArrayList<>();

      if (type != null) {
        predicates.add(cb.equal(root.get("resourceType"), type));
      }
      if (minCapacity != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("capacity"), minCapacity));
      }
      if (building != null && !building.isBlank()) {
        predicates.add(
            cb.like(cb.lower(root.get("building")), "%" + building.trim().toLowerCase() + "%"));
      }
      if (status != null) {
        predicates.add(cb.equal(root.get("status"), status));
      }
      if (tag != null && !tag.isBlank()) {
        Subquery<Long> sq = query.subquery(Long.class);
        Root<ResourceTagMapping> rm = sq.from(ResourceTagMapping.class);
        Join<ResourceTagMapping, ResourceTag> t = rm.join("tag", JoinType.INNER);
        sq.select(rm.get("resourceTagMappingId"))
            .where(
                cb.and(
                    cb.equal(rm.get("resource").get("resourceId"), root.get("resourceId")),
                    cb.like(cb.lower(t.get("tagName")), "%" + tag.trim().toLowerCase() + "%")));
        predicates.add(cb.exists(sq));
      }
      if (search != null && !search.isBlank()) {
        String q = "%" + search.trim().toLowerCase() + "%";
        Predicate name = cb.like(cb.lower(root.get("resourceName")), q);
        Predicate code = cb.like(cb.lower(root.get("resourceCode")), q);
        Predicate desc = cb.like(cb.lower(root.get("description")), q);
        Predicate loc = cb.like(cb.lower(root.get("fullLocationDescription")), q);
        predicates.add(cb.or(name, code, desc, loc));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
