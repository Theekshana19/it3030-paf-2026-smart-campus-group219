package lk.sliit.smartcampus.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.request.BookingReviewRequest;
import lk.sliit.smartcampus.dto.response.BookingListResponse;
import lk.sliit.smartcampus.dto.response.BookingResponse;
import lk.sliit.smartcampus.dto.response.ConflictDetailResponse;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.enums.BookingStatus;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.exception.BookingConflictException;
import lk.sliit.smartcampus.exception.BookingNotFoundException;
import lk.sliit.smartcampus.exception.InvalidBookingStateException;
import lk.sliit.smartcampus.exception.ResourceNotFoundException;
import lk.sliit.smartcampus.mapper.BookingMapper;
import lk.sliit.smartcampus.repository.BookingRepository;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.service.BookingService;
import lk.sliit.smartcampus.service.NotificationService;
import lk.sliit.smartcampus.util.BookingSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class BookingServiceImpl implements BookingService {

  private static final Set<String> ALLOWED_SORT_FIELDS =
      Set.of("bookingId", "bookingRef", "bookingDate", "startTime",
          "bookingStatus", "userName", "createdAt", "updatedAt");

  private static final DateTimeFormatter REF_DATE_FMT =
      DateTimeFormatter.ofPattern("yyyyMMdd");

  private final BookingRepository bookingRepository;
  private final ResourceRepository resourceRepository;
  private final BookingMapper bookingMapper;
  private final NotificationService notificationService;

  public BookingServiceImpl(
      BookingRepository bookingRepository,
      ResourceRepository resourceRepository,
      BookingMapper bookingMapper,
      NotificationService notificationService) {
    this.bookingRepository = bookingRepository;
    this.resourceRepository = resourceRepository;
    this.bookingMapper = bookingMapper;
    this.notificationService = notificationService;
  }

  @Override
  public BookingResponse create(BookingCreateRequest request) {
    Resource resource = loadResource(request.getResourceId());

    // check if resource is active
    if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE) {
      throw new InvalidBookingStateException(
          "Resource " + resource.getResourceName() + " is currently out of service");
    }

    // check for time conflicts with approved bookings
    List<Booking> conflicts = bookingRepository.findOverlapping(
        resource.getResourceId(),
        request.getBookingDate(),
        request.getStartTime().toString(),
        request.getEndTime().toString());

    if (!conflicts.isEmpty()) {
      Booking first = conflicts.get(0);
      throw new BookingConflictException(
          "Time conflict with booking " + first.getBookingRef()
          + " (" + first.getStartTime() + " - " + first.getEndTime() + ")"
          + " for " + resource.getResourceName());
    }

    Booking entity = bookingMapper.toNewEntity(request, resource);
    entity.setBookingRef(generateBookingRef(request.getBookingDate()));
    entity.setBookingStatus(BookingStatus.PENDING);
    entity.setIsActive(true);

    LocalDateTime now = LocalDateTime.now();
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);

    Booking saved = bookingRepository.save(entity);
    return bookingMapper.toResponse(saved);
  }

  @Override
  public BookingResponse update(Long bookingId, BookingCreateRequest request) {
    Booking entity = loadBooking(bookingId);

    // only pending bookings can be updated
    if (entity.getBookingStatus() != BookingStatus.PENDING) {
      throw new InvalidBookingStateException(
          "Only PENDING bookings can be updated, current status: "
          + entity.getBookingStatus());
    }

    Resource resource = loadResource(request.getResourceId());

    // check for conflicts (exclude the current booking)
    List<Booking> conflicts = bookingRepository.findOverlapping(
        resource.getResourceId(),
        request.getBookingDate(),
        request.getStartTime().toString(),
        request.getEndTime().toString());

    conflicts.removeIf(b -> b.getBookingId().equals(bookingId));

    if (!conflicts.isEmpty()) {
      Booking first = conflicts.get(0);
      throw new BookingConflictException(
          "Time conflict with booking " + first.getBookingRef()
          + " (" + first.getStartTime() + " - " + first.getEndTime() + ")");
    }

    bookingMapper.apply(entity, request, resource);
    entity.setUpdatedAt(LocalDateTime.now());
    Booking saved = bookingRepository.save(entity);
    return bookingMapper.toResponse(saved);
  }

  @Override
  public void delete(Long bookingId) {
    if (!bookingRepository.existsById(bookingId)) {
      throw new BookingNotFoundException(bookingId);
    }
    bookingRepository.deleteById(bookingId);
  }

  @Override
  @Transactional(readOnly = true)
  public BookingResponse getById(Long bookingId) {
    return bookingMapper.toResponse(loadBooking(bookingId));
  }

  @Override
  @Transactional(readOnly = true)
  public BookingListResponse findAll(
      Long resourceId,
      BookingStatus status,
      String userEmail,
      LocalDate dateFrom,
      LocalDate dateTo,
      String search,
      Integer page,
      Integer size,
      String sortBy,
      String sortDir) {

    Specification<Booking> spec = BookingSpecifications.filter(
        resourceId, status, userEmail, dateFrom, dateTo, search);

    if (!StringUtils.hasText(sortBy) || !ALLOWED_SORT_FIELDS.contains(sortBy)) {
      throw new IllegalArgumentException(
          "sortBy must be one of: " + String.join(", ", ALLOWED_SORT_FIELDS));
    }

    Sort sort = "desc".equalsIgnoreCase(sortDir)
        ? Sort.by(sortBy).descending()
        : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<Booking> bookingPage = bookingRepository.findAll(spec, pageable);

    List<BookingResponse> items = bookingPage.getContent().stream()
        .map(bookingMapper::toResponse)
        .toList();

    return BookingListResponse.builder()
        .items(items)
        .totalItems(bookingPage.getTotalElements())
        .page(bookingPage.getNumber())
        .size(bookingPage.getSize())
        .totalPages(bookingPage.getTotalPages())
        .build();
  }

  @Override
  public BookingResponse reviewBooking(Long bookingId, BookingReviewRequest request) {
    Booking entity = loadBooking(bookingId);

    // only pending bookings can be reviewed
    if (entity.getBookingStatus() != BookingStatus.PENDING) {
      throw new InvalidBookingStateException(
          "Only PENDING bookings can be reviewed, current status: "
          + entity.getBookingStatus());
    }

    LocalDateTime now = LocalDateTime.now();

    if (Boolean.TRUE.equals(request.getApproved())) {
      entity.setBookingStatus(BookingStatus.APPROVED);
    } else {
      // reject requires a remark
      if (request.getAdminRemark() == null || request.getAdminRemark().isBlank()) {
        throw new InvalidBookingStateException(
            "Admin remark is required when rejecting a booking");
      }
      entity.setBookingStatus(BookingStatus.REJECTED);
    }

    entity.setAdminRemark(request.getAdminRemark());
    entity.setReviewedBy(request.getReviewerEmail());
    entity.setReviewedAt(now);
    entity.setUpdatedAt(now);

    Booking saved = bookingRepository.save(entity);
    notificationService.notifyBookingUpdate(saved);
    return bookingMapper.toResponse(saved);
  }

  @Override
  public BookingResponse cancelBooking(Long bookingId, String userEmail) {
    Booking entity = loadBooking(bookingId);

    // only approved bookings can be cancelled
    if (entity.getBookingStatus() != BookingStatus.APPROVED) {
      throw new InvalidBookingStateException(
          "Only APPROVED bookings can be cancelled, current status: "
          + entity.getBookingStatus());
    }

    entity.setBookingStatus(BookingStatus.CANCELLED);
    entity.setUpdatedAt(LocalDateTime.now());

    Booking saved = bookingRepository.save(entity);
    notificationService.notifyBookingUpdate(saved);
    return bookingMapper.toResponse(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public List<ConflictDetailResponse> checkConflicts(
      Long resourceId, LocalDate date, LocalTime startTime, LocalTime endTime) {

    List<Booking> conflicts = bookingRepository.findOverlapping(
        resourceId, date, startTime.toString(), endTime.toString());

    if (conflicts.isEmpty()) {
      return Collections.emptyList();
    }

    Resource original = loadResource(resourceId);

    // find next available time on the same resource (after last conflict ends)
    LocalTime latestEnd = conflicts.stream()
        .map(Booking::getEndTime)
        .max(LocalTime::compareTo)
        .orElse(endTime);

    String nextSlot = latestEnd.isBefore(LocalTime.of(20, 0))
        ? latestEnd + " onwards"
        : "No more slots today";

    // find alternative resources with same type that are free at this time
    List<Resource> allSameType = resourceRepository.findByResourceType(
        original.getResourceType());

    List<String> alternatives = allSameType.stream()
        .filter(r -> !r.getResourceId().equals(resourceId))
        .filter(r -> r.getStatus() == ResourceStatus.ACTIVE)
        .filter(r -> {
          List<Booking> otherConflicts = bookingRepository.findOverlapping(
              r.getResourceId(), date, startTime.toString(), endTime.toString());
          return otherConflicts.isEmpty();
        })
        .map(r -> r.getResourceName()
            + " (capacity " + (r.getCapacity() != null ? r.getCapacity() : "N/A")
            + ", " + r.getBuilding() + ")")
        .toList();

    // build detailed response for each conflict
    return conflicts.stream()
        .map(c -> ConflictDetailResponse.builder()
            .conflictBookingRef(c.getBookingRef())
            .conflictStartTime(c.getStartTime())
            .conflictEndTime(c.getEndTime())
            .conflictPurpose(c.getPurpose())
            .conflictAttendees(c.getExpectedCount())
            .nextAvailableSlot(nextSlot)
            .alternativeResources(alternatives)
            .build())
        .toList();
  }

  // generate unique booking ref like BK-20260410-001, sequence resets each day
  private String generateBookingRef(LocalDate date) {
    String prefix = "BK-" + date.format(REF_DATE_FMT) + "-";
    long count = bookingRepository.countByBookingDate(date);
    String ref;
    do {
      count++;
      ref = prefix + String.format("%03d", count);
    } while (bookingRepository.existsByBookingRefIgnoreCase(ref));
    return ref;
  }

  private Booking loadBooking(Long id) {
    return bookingRepository.findById(id)
        .orElseThrow(() -> new BookingNotFoundException(id));
  }

  private Resource loadResource(Long id) {
    return resourceRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(id));
  }
}
