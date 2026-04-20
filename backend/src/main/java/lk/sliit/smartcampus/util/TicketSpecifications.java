package lk.sliit.smartcampus.util;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lk.sliit.smartcampus.enums.TicketStatus;
import org.springframework.data.jpa.domain.Specification;

// this class builds dynamic query filters for the ticket list endpoint
// each filter is optional and they combine together with AND logic
public final class TicketSpecifications {

  private TicketSpecifications() {}

  public static Specification<Ticket> filter(
      Long resourceId,
      TicketStatus status,
      TicketPriority priority,
      TicketCategory category,
      String reporterEmail,
      String assignedToEmail,
      String search) {

    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // filter by resource that has the issue
      if (resourceId != null) {
        predicates.add(cb.equal(root.get("resource").get("resourceId"), resourceId));
      }

      // filter by current ticket status
      if (status != null) {
        predicates.add(cb.equal(root.get("ticketStatus"), status));
      }

      // filter by how urgent the issue is
      if (priority != null) {
        predicates.add(cb.equal(root.get("priority"), priority));
      }

      // filter by what type of issue it is
      if (category != null) {
        predicates.add(cb.equal(root.get("category"), category));
      }

      // filter by who reported the issue
      if (reporterEmail != null && !reporterEmail.isBlank()) {
        predicates.add(cb.equal(
            cb.lower(root.get("reporterEmail")),
            reporterEmail.trim().toLowerCase()));
      }

      // filter by which technician is assigned
      if (assignedToEmail != null && !assignedToEmail.isBlank()) {
        predicates.add(cb.equal(
            cb.lower(root.get("assignedToEmail")),
            assignedToEmail.trim().toLowerCase()));
      }

      // search across title, description, and ticket reference
      if (search != null && !search.isBlank()) {
        String searchPattern = "%" + search.trim().toLowerCase() + "%";
        Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
        Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
        Predicate refMatch = cb.like(cb.lower(root.get("ticketRef")), searchPattern);
        predicates.add(cb.or(titleMatch, descMatch, refMatch));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
