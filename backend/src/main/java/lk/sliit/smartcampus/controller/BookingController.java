package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.request.BookingReviewRequest;
import lk.sliit.smartcampus.dto.response.BookingListResponse;
import lk.sliit.smartcampus.dto.response.BookingResponse;
import lk.sliit.smartcampus.dto.response.ConflictDetailResponse;
import lk.sliit.smartcampus.enums.BookingStatus;
import lk.sliit.smartcampus.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

  private final BookingService bookingService;
  private final JdbcTemplate jdbcTemplate;

  public BookingController(BookingService bookingService, JdbcTemplate jdbcTemplate) {
    this.bookingService = bookingService;
    this.jdbcTemplate = jdbcTemplate;
  }

  // check if booking module db connection works
  @GetMapping("/test-db")
  public Map<String, Object> testDbConnection() {
    jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    return Map.of("connected", true, "module", "Member 2 Bookings");
  }

  // create a new booking request
  @PostMapping
  public ResponseEntity<BookingResponse> create(
      @Valid @RequestBody BookingCreateRequest request) {
    BookingResponse body = bookingService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  // list bookings with filters and pagination
  @GetMapping
  public BookingListResponse list(
      @RequestParam(required = false) Long resourceId,
      @RequestParam(required = false) BookingStatus status,
      @RequestParam(required = false) String userEmail,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
      @RequestParam(required = false) String search,
      @RequestParam(defaultValue = "0") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "bookingId") String sortBy,
      @RequestParam(defaultValue = "desc") String sortDir) {

    if (page < 0) {
      throw new IllegalArgumentException("page must be greater than or equal to 0");
    }
    if (size < 1 || size > 100) {
      throw new IllegalArgumentException("size must be between 1 and 100");
    }
    if (!"asc".equalsIgnoreCase(sortDir) && !"desc".equalsIgnoreCase(sortDir)) {
      throw new IllegalArgumentException("sortDir must be either 'asc' or 'desc'");
    }

    return bookingService.findAll(
        resourceId, status, userEmail, dateFrom, dateTo,
        search, page, size, sortBy, sortDir);
  }

  // get a single booking by id
  @GetMapping("/{bookingId}")
  public BookingResponse getById(@PathVariable Long bookingId) {
    return bookingService.getById(bookingId);
  }

  // update a pending booking
  @PutMapping("/{bookingId}")
  public BookingResponse update(
      @PathVariable Long bookingId,
      @Valid @RequestBody BookingCreateRequest request) {
    return bookingService.update(bookingId, request);
  }

  // delete a booking
  @DeleteMapping("/{bookingId}")
  public ResponseEntity<Void> delete(@PathVariable Long bookingId) {
    bookingService.delete(bookingId);
    return ResponseEntity.noContent().build();
  }

  // admin approves or rejects a booking
  @PatchMapping("/{bookingId}/review")
  public BookingResponse review(
      @PathVariable Long bookingId,
      @Valid @RequestBody BookingReviewRequest request) {
    return bookingService.reviewBooking(bookingId, request);
  }

  // user cancels their approved booking
  @PatchMapping("/{bookingId}/cancel")
  public BookingResponse cancel(
      @PathVariable Long bookingId,
      @RequestParam String userEmail) {
    return bookingService.cancelBooking(bookingId, userEmail);
  }

  // check for time conflicts before submitting a booking
  @GetMapping("/conflicts")
  public List<ConflictDetailResponse> checkConflicts(
      @RequestParam Long resourceId,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
      @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime endTime) {
    return bookingService.checkConflicts(resourceId, date, startTime, endTime);
  }
}
