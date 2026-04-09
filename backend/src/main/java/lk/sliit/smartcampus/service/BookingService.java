package lk.sliit.smartcampus.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.request.BookingReviewRequest;
import lk.sliit.smartcampus.dto.response.BookingListResponse;
import lk.sliit.smartcampus.dto.response.BookingResponse;
import lk.sliit.smartcampus.dto.response.ConflictDetailResponse;
import lk.sliit.smartcampus.enums.BookingStatus;

public interface BookingService {

  BookingResponse create(BookingCreateRequest request);

  BookingResponse update(Long bookingId, BookingCreateRequest request);

  void delete(Long bookingId);

  BookingResponse getById(Long bookingId);

  BookingListResponse findAll(
      Long resourceId,
      BookingStatus status,
      String userEmail,
      LocalDate dateFrom,
      LocalDate dateTo,
      String search,
      Integer page,
      Integer size,
      String sortBy,
      String sortDir);

  BookingResponse reviewBooking(Long bookingId, BookingReviewRequest request);

  BookingResponse cancelBooking(Long bookingId, String userEmail);

  List<ConflictDetailResponse> checkConflicts(
      Long resourceId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
