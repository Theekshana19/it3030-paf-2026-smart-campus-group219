package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lk.sliit.smartcampus.dto.request.TicketAssignRequest;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketRejectRequest;
import lk.sliit.smartcampus.dto.request.TicketResolveRequest;
import lk.sliit.smartcampus.dto.response.PatternAlertResponse;
import lk.sliit.smartcampus.dto.response.TicketAttachmentResponse;
import lk.sliit.smartcampus.dto.response.TicketListResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lk.sliit.smartcampus.enums.TicketStatus;
import lk.sliit.smartcampus.service.TicketAttachmentService;
import lk.sliit.smartcampus.service.TicketService;
import org.springframework.core.io.Resource;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

// this controller handles all ticket-related REST endpoints
// it covers the full ticket lifecycle and attachment management
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

  private final TicketService ticketService;
  private final TicketAttachmentService attachmentService;
  private final JdbcTemplate jdbcTemplate;

  public TicketController(
      TicketService ticketService,
      TicketAttachmentService attachmentService,
      JdbcTemplate jdbcTemplate) {
    this.ticketService = ticketService;
    this.attachmentService = attachmentService;
    this.jdbcTemplate = jdbcTemplate;
  }

  // check if ticket module db connection works
  @GetMapping("/test-db")
  public Map<String, Object> testDbConnection() {
    jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    return Map.of("connected", true, "module", "Member 3 Tickets");
  }

  // create a new incident ticket
  @PostMapping
  public ResponseEntity<TicketResponse> create(
      @Valid @RequestBody TicketCreateRequest request) {
    TicketResponse body = ticketService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  // list all tickets with filters and pagination
  @GetMapping
  public TicketListResponse list(
      @RequestParam(required = false) Long resourceId,
      @RequestParam(required = false) TicketStatus status,
      @RequestParam(required = false) TicketPriority priority,
      @RequestParam(required = false) TicketCategory category,
      @RequestParam(required = false) String reporterEmail,
      @RequestParam(required = false) String assignedToEmail,
      @RequestParam(required = false) String search,
      @RequestParam(defaultValue = "0") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "ticketId") String sortBy,
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

    return ticketService.findAll(
        resourceId, status, priority, category, reporterEmail, assignedToEmail,
        search, page, size, sortBy, sortDir);
  }

  // get a single ticket with all its details
  @GetMapping("/{ticketId}")
  public TicketResponse getById(@PathVariable Long ticketId) {
    return ticketService.getById(ticketId);
  }

  // update a ticket that is still in OPEN status
  @PutMapping("/{ticketId}")
  public TicketResponse update(
      @PathVariable Long ticketId,
      @Valid @RequestBody TicketCreateRequest request) {
    return ticketService.update(ticketId, request);
  }

  // delete a ticket permanently
  @DeleteMapping("/{ticketId}")
  public ResponseEntity<Void> delete(@PathVariable Long ticketId) {
    ticketService.delete(ticketId);
    return ResponseEntity.noContent().build();
  }

  // any authenticated user can assign a technician to work on the ticket
  // (keeps demo flow working when accounts are default USER)
  @PreAuthorize("isAuthenticated()")
  @PatchMapping("/{ticketId}/assign")
  public TicketResponse assign(
      @PathVariable Long ticketId,
      @Valid @RequestBody TicketAssignRequest request) {
    return ticketService.assignTechnician(ticketId, request);
  }

  // any authenticated user can mark the ticket as resolved with notes
  // (keeps demo flow working when accounts are default USER)
  @PreAuthorize("isAuthenticated()")
  @PatchMapping("/{ticketId}/resolve")
  public TicketResponse resolve(
      @PathVariable Long ticketId,
      @Valid @RequestBody TicketResolveRequest request) {
    return ticketService.resolveTicket(ticketId, request);
  }

  // admin closes a resolved ticket
  @PreAuthorize("hasRole('ADMIN')")
  @PatchMapping("/{ticketId}/close")
  public TicketResponse close(@PathVariable Long ticketId) {
    return ticketService.closeTicket(ticketId);
  }

  // admin rejects a ticket with a reason
  @PreAuthorize("hasRole('ADMIN')")
  @PatchMapping("/{ticketId}/reject")
  public TicketResponse reject(
      @PathVariable Long ticketId,
      @Valid @RequestBody TicketRejectRequest request) {
    return ticketService.rejectTicket(ticketId, request);
  }

  // check if this resource has a recurring pattern of similar issues
  @GetMapping("/{ticketId}/pattern-alert")
  public PatternAlertResponse patternAlert(@PathVariable Long ticketId) {
    return ticketService.checkPattern(ticketId);
  }

  // ---- Attachment endpoints ----

  // upload an image attachment to a ticket (max 3 per ticket)
  @PostMapping("/{ticketId}/attachments")
  public ResponseEntity<TicketAttachmentResponse> uploadAttachment(
      @PathVariable Long ticketId,
      @RequestParam("file") MultipartFile file) {
    TicketAttachmentResponse body = attachmentService.uploadAttachment(ticketId, file);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  // list all attachments for a ticket
  @GetMapping("/{ticketId}/attachments")
  public List<TicketAttachmentResponse> listAttachments(@PathVariable Long ticketId) {
    return attachmentService.getAttachmentsByTicket(ticketId);
  }

  // download an attachment file
  @GetMapping("/{ticketId}/attachments/{attachmentId}")
  public ResponseEntity<Resource> downloadAttachment(
      @PathVariable Long ticketId,
      @PathVariable Long attachmentId) {
    Resource file = attachmentService.downloadAttachment(ticketId, attachmentId);
    String contentType = attachmentService.getContentType(attachmentId);
    return ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
        .body(file);
  }

  // delete an attachment from a ticket
  @DeleteMapping("/{ticketId}/attachments/{attachmentId}")
  public ResponseEntity<Void> deleteAttachment(
      @PathVariable Long ticketId,
      @PathVariable Long attachmentId) {
    attachmentService.deleteAttachment(ticketId, attachmentId);
    return ResponseEntity.noContent().build();
  }
}
