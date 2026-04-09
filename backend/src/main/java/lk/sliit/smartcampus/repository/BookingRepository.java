package lk.sliit.smartcampus.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository
    extends JpaRepository<Booking, Long>, JpaSpecificationExecutor<Booking> {

  // check if booking ref already exists
  boolean existsByBookingRefIgnoreCase(String bookingRef);

  // find overlapping approved bookings for conflict detection
  @Query("SELECT b FROM Booking b WHERE b.resource.resourceId = :resourceId "
      + "AND b.bookingDate = :date "
      + "AND b.bookingStatus = 'APPROVED' "
      + "AND b.startTime < :endTime "
      + "AND b.endTime > :startTime")
  List<Booking> findOverlapping(
      @Param("resourceId") Long resourceId,
      @Param("date") LocalDate date,
      @Param("startTime") LocalTime startTime,
      @Param("endTime") LocalTime endTime);

  // count bookings for a resource on a specific date
  long countByResource_ResourceIdAndBookingDateAndBookingStatus(
      Long resourceId, LocalDate bookingDate, BookingStatus status);

  // find all bookings by user email
  List<Booking> findByUserEmailIgnoreCase(String userEmail);
}
