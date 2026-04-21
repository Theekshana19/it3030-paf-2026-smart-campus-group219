package lk.sliit.smartcampus.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.request.BookingDecisionRequest;
import lk.sliit.smartcampus.dto.response.BookingResponse;
import lk.sliit.smartcampus.security.AuthTokenExtractor;
import lk.sliit.smartcampus.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/bookings")
public class BookingController {

  private final BookingService bookingService;
  private final AuthTokenExtractor authTokenExtractor;

  public BookingController(BookingService bookingService, AuthTokenExtractor authTokenExtractor) {
    this.bookingService = bookingService;
    this.authTokenExtractor = authTokenExtractor;
  }

  private String token(HttpServletRequest request) {
    String t = authTokenExtractor.extract(request);
    if (t.isBlank()) {
      throw new IllegalArgumentException("Authentication token required");
    }
    return t;
  }

  @PostMapping
  public ResponseEntity<BookingResponse> create(
      @Valid @RequestBody BookingCreateRequest body, HttpServletRequest request) {
    BookingResponse created = bookingService.create(body, token(request));
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping("/mine")
  public List<BookingResponse> listMine(HttpServletRequest request) {
    return bookingService.listMine(token(request));
  }

  @GetMapping("/pending")
  public List<BookingResponse> listPending(HttpServletRequest request) {
    return bookingService.listPending(token(request));
  }

  @PatchMapping("/{id}/decision")
  public BookingResponse decide(
      @PathVariable("id") Long bookingId,
      @Valid @RequestBody BookingDecisionRequest body,
      HttpServletRequest request) {
    return bookingService.decide(bookingId, body, token(request));
  }
}
