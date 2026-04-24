package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import lk.sliit.smartcampus.dto.request.TicketAssignRequest;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketRejectRequest;
import lk.sliit.smartcampus.dto.request.TicketResolveRequest;
import lk.sliit.smartcampus.dto.response.PatternAlertResponse;
import lk.sliit.smartcampus.dto.response.TicketListResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lk.sliit.smartcampus.enums.TicketStatus;
import lk.sliit.smartcampus.exception.InvalidTicketStateException;
import lk.sliit.smartcampus.exception.ResourceNotFoundException;
import lk.sliit.smartcampus.exception.TicketNotFoundException;
import lk.sliit.smartcampus.mapper.TicketMapper;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.TicketRepository;
import lk.sliit.smartcampus.service.NotificationService;
import lk.sliit.smartcampus.service.TicketService;
import lk.sliit.smartcampus.util.TicketSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

// this service handles all the business logic for incident tickets
// it manages the full ticket lifecycle from creation to closure
@Service
@Transactional
public class TicketServiceImpl implements TicketService {

  private static final Set<String> ALLOWED_SORT_FIELDS =
      Set.of("ticketId", "ticketRef", "title", "priority", "ticketStatus",
          "category", "reporterName", "createdAt", "updatedAt");

  private static final DateTimeFormatter REF_DATE_FMT =
      DateTimeFormatter.ofPattern("yyyyMMdd");

  private final TicketRepository ticketRepository;
  private final ResourceRepository resourceRepository;
  private final TicketMapper ticketMapper;
  private final NotificationService notificationService;

  public TicketServiceImpl(
      TicketRepository ticketRepository,
      ResourceRepository resourceRepository,
      TicketMapper ticketMapper,
      NotificationService notificationService) {
    this.ticketRepository = ticketRepository;
    this.resourceRepository = resourceRepository;
    this.ticketMapper = ticketMapper;
    this.notificationService = notificationService;
  }

  // this method creates a new incident ticket
  // it generates a unique reference number and saves to database
  // the ticket starts with OPEN status by default
  @Override
  public TicketResponse create(TicketCreateRequest request) {
    Resource resource = null;
    if (request.getResourceId() != null) {
      resource = resourceRepository.findById(request.getResourceId())
          .orElseThrow(() -> new ResourceNotFoundException(request.getResourceId()));
    }

    Ticket entity = ticketMapper.toNewEntity(request, resource);
    entity.setTicketRef(generateTicketRef());
    entity.setTicketStatus(TicketStatus.OPEN);
    entity.setIsActive(true);

    LocalDateTime now = LocalDateTime.now();
    entity.setCreatedAt(now);
    entity.setUpdatedAt(now);

    Ticket saved = ticketRepository.save(entity);
    notificationService.notifyTicketCreated(saved);
    return ticketMapper.toResponse(saved);
  }

  // update an existing ticket, but only if it is still in OPEN status
  // once a ticket moves to another status it should not be edited this way
  @Override
  public TicketResponse update(Long ticketId, TicketCreateRequest request) {
    Ticket entity = loadTicket(ticketId);

    if (entity.getTicketStatus() != TicketStatus.OPEN) {
      throw new InvalidTicketStateException(
          "Only OPEN tickets can be updated, current status is " + entity.getTicketStatus());
    }

    Resource resource = null;
    if (request.getResourceId() != null) {
      resource = resourceRepository.findById(request.getResourceId())
          .orElseThrow(() -> new ResourceNotFoundException(request.getResourceId()));
    }

    ticketMapper.applyUpdate(entity, request, resource);
    entity.setUpdatedAt(LocalDateTime.now());
    Ticket saved = ticketRepository.save(entity);
    return ticketMapper.toResponse(saved);
  }

  @Override
  public void delete(Long ticketId) {
    if (!ticketRepository.existsById(ticketId)) {
      throw new TicketNotFoundException(ticketId);
    }
    ticketRepository.deleteById(ticketId);
  }

  @Override
  @Transactional(readOnly = true)
  public TicketResponse getById(Long ticketId) {
    return ticketMapper.toResponse(loadTicket(ticketId));
  }

  @Override
  @Transactional(readOnly = true)
  public TicketListResponse findAll(
      Long resourceId, TicketStatus status, TicketPriority priority,
      TicketCategory category, String reporterEmail, String assignedToEmail,
      String search, Integer page, Integer size, String sortBy, String sortDir) {

    Specification<Ticket> spec = TicketSpecifications.filter(
        resourceId, status, priority, category, reporterEmail, assignedToEmail, search);

    if (!StringUtils.hasText(sortBy) || !ALLOWED_SORT_FIELDS.contains(sortBy)) {
      throw new IllegalArgumentException(
          "sortBy must be one of: " + String.join(", ", ALLOWED_SORT_FIELDS));
    }

    Sort sort = "desc".equalsIgnoreCase(sortDir)
        ? Sort.by(sortBy).descending()
        : Sort.by(sortBy).ascending();

    Pageable pageable = PageRequest.of(page, size, sort);
    Page<Ticket> ticketPage = ticketRepository.findAll(spec, pageable);

    List<TicketResponse> items = ticketPage.getContent().stream()
        .map(ticketMapper::toResponse)
        .toList();

    return TicketListResponse.builder()
        .items(items)
        .totalItems(ticketPage.getTotalElements())
        .page(ticketPage.getNumber())
        .size(ticketPage.getSize())
        .totalPages(ticketPage.getTotalPages())
        .build();
  }

  // when assigning a technician, we update the ticket status to IN_PROGRESS
  // also record who was assigned and when the assignment happened
  @Override
  public TicketResponse assignTechnician(Long ticketId, TicketAssignRequest request) {
    Ticket entity = loadTicket(ticketId);

    if (entity.getTicketStatus() != TicketStatus.OPEN) {
      throw new InvalidTicketStateException(
          "Only OPEN tickets can be assigned, current status is " + entity.getTicketStatus());
    }

    LocalDateTime now = LocalDateTime.now();
    entity.setTicketStatus(TicketStatus.IN_PROGRESS);
    entity.setAssignedToEmail(request.getAssignedToEmail().trim());
    entity.setAssignedToName(request.getAssignedToName().trim());
    entity.setAssignedAt(now);
    entity.setUpdatedAt(now);

    Ticket saved = ticketRepository.save(entity);
    notificationService.notifyTicketUpdate(saved);
    return ticketMapper.toResponse(saved);
  }

  // when technician finishes fixing the issue they resolve the ticket
  // resolution notes explain what was done to fix the problem
  @Override
  public TicketResponse resolveTicket(Long ticketId, TicketResolveRequest request) {
    Ticket entity = loadTicket(ticketId);

    if (entity.getTicketStatus() != TicketStatus.IN_PROGRESS) {
      throw new InvalidTicketStateException(
          "Only IN_PROGRESS tickets can be resolved, current status is " + entity.getTicketStatus());
    }

    LocalDateTime now = LocalDateTime.now();
    entity.setTicketStatus(TicketStatus.RESOLVED);
    entity.setResolutionNotes(request.getResolutionNotes().trim());
    entity.setResolvedAt(now);
    entity.setUpdatedAt(now);

    Ticket saved = ticketRepository.save(entity);
    notificationService.notifyTicketUpdate(saved);
    return ticketMapper.toResponse(saved);
  }

  // admin closes a resolved ticket to complete the workflow
  @Override
  public TicketResponse closeTicket(Long ticketId) {
    Ticket entity = loadTicket(ticketId);

    if (entity.getTicketStatus() != TicketStatus.RESOLVED) {
      throw new InvalidTicketStateException(
          "Only RESOLVED tickets can be closed, current status is " + entity.getTicketStatus());
    }

    LocalDateTime now = LocalDateTime.now();
    entity.setTicketStatus(TicketStatus.CLOSED);
    entity.setClosedAt(now);
    entity.setUpdatedAt(now);

    Ticket saved = ticketRepository.save(entity);
    notificationService.notifyTicketUpdate(saved);
    return ticketMapper.toResponse(saved);
  }

  // admin rejects a ticket with a reason explaining why
  @Override
  public TicketResponse rejectTicket(Long ticketId, TicketRejectRequest request) {
    Ticket entity = loadTicket(ticketId);

    if (entity.getTicketStatus() != TicketStatus.OPEN) {
      throw new InvalidTicketStateException(
          "Only OPEN tickets can be rejected, current status is " + entity.getTicketStatus());
    }

    entity.setTicketStatus(TicketStatus.REJECTED);
    entity.setRejectReason(request.getRejectReason().trim());
    entity.setUpdatedAt(LocalDateTime.now());

    Ticket saved = ticketRepository.save(entity);
    notificationService.notifyTicketUpdate(saved);
    return ticketMapper.toResponse(saved);
  }

  // pattern detection - check if this resource has multiple tickets
  // with the same category in the last 30 days
  // if count is 3 or more, we flag it as a recurring issue
  @Override
  @Transactional(readOnly = true)
  public PatternAlertResponse checkPattern(Long ticketId) {
    Ticket ticket = loadTicket(ticketId);

    if (ticket.getResource() == null) {
      return PatternAlertResponse.builder().isRecurring(false).build();
    }

    LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

    long ticketCount = ticketRepository.countByResource_ResourceIdAndCategoryAndCreatedAtAfter(
        ticket.getResource().getResourceId(),
        ticket.getCategory(),
        thirtyDaysAgo);

    boolean isRecurring = ticketCount >= 3;

    String recommendation = "";
    if (isRecurring) {
      recommendation = "This resource has " + ticketCount
          + " similar " + ticket.getCategory().name().replace("_", " ").toLowerCase()
          + " incidents in the last 30 days. "
          + "Consider taking it out of service for major repair or replacement.";
    }

    return PatternAlertResponse.builder()
        .resourceName(ticket.getResource().getResourceName())
        .category(ticket.getCategory().name())
        .ticketCount((int) ticketCount)
        .isRecurring(isRecurring)
        .recommendation(recommendation)
        .build();
  }

  // generate unique ticket ref like TK-20260410-001
  private String generateTicketRef() {
    String prefix = "TK-" + LocalDateTime.now().format(REF_DATE_FMT) + "-";
    long count = ticketRepository.count();
    String ref;
    do {
      count++;
      ref = prefix + String.format("%03d", count);
    } while (ticketRepository.existsByTicketRefIgnoreCase(ref));
    return ref;
  }

  private Ticket loadTicket(Long id) {
    return ticketRepository.findById(id)
        .orElseThrow(() -> new TicketNotFoundException(id));
  }
}
