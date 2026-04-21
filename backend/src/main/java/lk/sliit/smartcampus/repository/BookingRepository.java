package lk.sliit.smartcampus.repository;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

  List<Booking> findByUserUserIdOrderByStartAtDesc(Long userId);

  List<Booking> findByStatusOrderByCreatedAtAsc(BookingStatus status);

  @Query(
      "SELECT COUNT(b) FROM Booking b WHERE b.resource.resourceId = :resourceId "
          + "AND b.status IN (:statuses) AND b.endAt > :start AND b.startAt < :end")
  long countOverlapping(
      @Param("resourceId") Long resourceId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end,
      @Param("statuses") List<BookingStatus> statuses);
}
