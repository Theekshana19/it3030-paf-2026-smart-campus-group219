package lk.sliit.smartcampus.repository;

import java.time.LocalDate;
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
  // native query with CAST avoids Hibernate binding LocalTime as datetime2 in SQL Server
  @Query(value = "SELECT * FROM bookings WHERE resource_id = :resourceId "
      + "AND booking_date = :date "
      + "AND booking_status = 'APPROVED' "
      + "AND start_time < CAST(:endTime AS time) "
      + "AND end_time > CAST(:startTime AS time)",
      nativeQuery = true)
  List<Booking> findOverlapping(
      @Param("resourceId") Long resourceId,
      @Param("date") LocalDate date,
      @Param("startTime") String startTime,
      @Param("endTime") String endTime);

  // count bookings for a resource on a specific date
  long countByResource_ResourceIdAndBookingDateAndBookingStatus(
      Long resourceId, LocalDate bookingDate, BookingStatus status);

  // find all bookings by user email
  List<Booking> findByUserEmailIgnoreCase(String userEmail);
}
