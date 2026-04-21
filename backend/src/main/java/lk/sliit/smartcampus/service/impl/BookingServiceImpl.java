package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.request.BookingDecisionRequest;
import lk.sliit.smartcampus.dto.response.BookingResponse;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.BookingStatus;
import lk.sliit.smartcampus.enums.NotificationType;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.exception.BookingNotFoundException;
import lk.sliit.smartcampus.exception.ResourceNotFoundException;
import lk.sliit.smartcampus.repository.BookingRepository;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.security.GoogleTokenResolutionService;
import lk.sliit.smartcampus.service.BookingService;
import lk.sliit.smartcampus.service.NotificationService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

  private final BookingRepository bookingRepository;
  private final ResourceRepository resourceRepository;
  private final GoogleTokenResolutionService tokenResolutionService;
  private final NotificationService notificationService;

  public BookingServiceImpl(
      BookingRepository bookingRepository,
      ResourceRepository resourceRepository,
      GoogleTokenResolutionService tokenResolutionService,
      NotificationService notificationService) {
    this.bookingRepository = bookingRepository;
    this.resourceRepository = resourceRepository;
    this.tokenResolutionService = tokenResolutionService;
    this.notificationService = notificationService;
  }

  @Override
  public BookingResponse create(BookingCreateRequest request, String googleToken) {
    User user = tokenResolutionService.resolveUser(googleToken);
    if (!request.getEndAt().isAfter(request.getStartAt())) {
      throw new IllegalArgumentException("endAt must be after startAt");
    }
    Resource resource =
        resourceRepository
            .findById(request.getResourceId())
            .orElseThrow(() -> new ResourceNotFoundException(request.getResourceId()));
    if (resource.getStatus() != ResourceStatus.ACTIVE) {
      throw new IllegalArgumentException("Resource is not available for booking");
    }
    long overlaps =
        bookingRepository.countOverlapping(
            resource.getResourceId(),
            request.getStartAt(),
            request.getEndAt(),
            List.of(BookingStatus.PENDING, BookingStatus.APPROVED));
    if (overlaps > 0) {
      throw new IllegalArgumentException("This time range overlaps an existing booking");
    }
    LocalDateTime now = LocalDateTime.now();
    Booking booking =
        Booking.builder()
            .user(user)
            .resource(resource)
            .startAt(request.getStartAt())
            .endAt(request.getEndAt())
            .status(BookingStatus.PENDING)
            .createdAt(now)
            .updatedAt(now)
            .build();
    return toResponse(bookingRepository.save(booking));
  }

  @Override
  @Transactional(readOnly = true)
  public List<BookingResponse> listMine(String googleToken) {
    User user = tokenResolutionService.resolveUser(googleToken);
    return bookingRepository.findByUserUserIdOrderByStartAtDesc(user.getUserId()).stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public List<BookingResponse> listPending(String googleToken) {
    User user = tokenResolutionService.resolveUser(googleToken);
    if (user.getRole() != UserRole.ADMIN) {
      throw new AccessDeniedException("Only administrators can view pending bookings");
    }
    return bookingRepository.findByStatusOrderByCreatedAtAsc(BookingStatus.PENDING).stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public BookingResponse decide(Long bookingId, BookingDecisionRequest request, String googleToken) {
    User admin = tokenResolutionService.resolveUser(googleToken);
    if (admin.getRole() != UserRole.ADMIN) {
      throw new AccessDeniedException("Only administrators can approve or reject bookings");
    }
    Booking booking =
        bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));
    if (booking.getStatus() != BookingStatus.PENDING) {
      throw new IllegalArgumentException("Only pending bookings can be decided");
    }
    boolean approved = Boolean.TRUE.equals(request.getApproved());
    booking.setStatus(approved ? BookingStatus.APPROVED : BookingStatus.REJECTED);
    booking.setDecisionNote(request.getNote());
    booking.setUpdatedAt(LocalDateTime.now());
    bookingRepository.save(booking);

    User owner = booking.getUser();
    Resource resource = booking.getResource();
    if (approved) {
      notificationService.createForUser(
          owner.getUserId(),
          NotificationType.BOOKING_APPROVED,
          "Booking approved",
          "Your booking for "
              + resource.getResourceName()
              + " ("
              + booking.getStartAt()
              + " – "
              + booking.getEndAt()
              + ") was approved.");
    } else {
      String reason =
          request.getNote() != null && !request.getNote().isBlank()
              ? " Reason: " + request.getNote().trim()
              : "";
      notificationService.createForUser(
          owner.getUserId(),
          NotificationType.BOOKING_REJECTED,
          "Booking rejected",
          "Your booking for "
              + resource.getResourceName()
              + " ("
              + booking.getStartAt()
              + " – "
              + booking.getEndAt()
              + ") was rejected."
              + reason);
    }

    return toResponse(booking);
  }

  private BookingResponse toResponse(Booking b) {
    return BookingResponse.builder()
        .bookingId(b.getBookingId())
        .resourceId(b.getResource().getResourceId())
        .resourceName(b.getResource().getResourceName())
        .startAt(b.getStartAt())
        .endAt(b.getEndAt())
        .status(b.getStatus())
        .decisionNote(b.getDecisionNote())
        .createdAt(b.getCreatedAt())
        .build();
  }
}
