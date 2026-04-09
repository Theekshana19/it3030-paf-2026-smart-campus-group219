package lk.sliit.smartcampus.util;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.enums.BookingStatus;
import org.springframework.data.jpa.domain.Specification;

public final class BookingSpecifications {

  private BookingSpecifications() {}

  public static Specification<Booking> filter(
      Long resourceId,
      BookingStatus status,
      String userEmail,
      LocalDate dateFrom,
      LocalDate dateTo,
      String search) {

    return (root, query, cb) -> {
      List<Predicate> predicates = new ArrayList<>();

      // filter by resource
      if (resourceId != null) {
        predicates.add(cb.equal(root.get("resource").get("resourceId"), resourceId));
      }

      // filter by booking status
      if (status != null) {
        predicates.add(cb.equal(root.get("bookingStatus"), status));
      }

      // filter by user email
      if (userEmail != null && !userEmail.isBlank()) {
        predicates.add(cb.equal(cb.lower(root.get("userEmail")),
            userEmail.trim().toLowerCase()));
      }

      // filter by date range
      if (dateFrom != null) {
        predicates.add(cb.greaterThanOrEqualTo(root.get("bookingDate"), dateFrom));
      }
      if (dateTo != null) {
        predicates.add(cb.lessThanOrEqualTo(root.get("bookingDate"), dateTo));
      }

      // search in purpose or user name
      if (search != null && !search.isBlank()) {
        String q = "%" + search.trim().toLowerCase() + "%";
        Predicate purposeMatch = cb.like(cb.lower(root.get("purpose")), q);
        Predicate nameMatch = cb.like(cb.lower(root.get("userName")), q);
        Predicate refMatch = cb.like(cb.lower(root.get("bookingRef")), q);
        predicates.add(cb.or(purposeMatch, nameMatch, refMatch));
      }

      return cb.and(predicates.toArray(new Predicate[0]));
    };
  }
}
