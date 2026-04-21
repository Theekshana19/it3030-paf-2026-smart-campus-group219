package lk.sliit.smartcampus.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.util.List;
import lk.sliit.smartcampus.dto.request.TicketCommentCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketStatusUpdateRequest;
import lk.sliit.smartcampus.dto.response.TicketCommentResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;
import lk.sliit.smartcampus.security.AuthTokenExtractor;
import lk.sliit.smartcampus.service.TicketService;
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
@RequestMapping("/api/tickets")
public class TicketController {

  private final TicketService ticketService;
  private final AuthTokenExtractor authTokenExtractor;

  public TicketController(TicketService ticketService, AuthTokenExtractor authTokenExtractor) {
    this.ticketService = ticketService;
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
  public ResponseEntity<TicketResponse> create(
      @Valid @RequestBody TicketCreateRequest body, HttpServletRequest request) {
    TicketResponse created = ticketService.create(body, token(request));
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }

  @GetMapping("/mine")
  public List<TicketResponse> listMine(HttpServletRequest request) {
    return ticketService.listMine(token(request));
  }

  @GetMapping("/{id}")
  public TicketResponse getById(@PathVariable("id") Long ticketId, HttpServletRequest request) {
    return ticketService.getById(ticketId, token(request));
  }

  @PatchMapping("/{id}/status")
  public TicketResponse updateStatus(
      @PathVariable("id") Long ticketId,
      @Valid @RequestBody TicketStatusUpdateRequest body,
      HttpServletRequest request) {
    return ticketService.updateStatus(ticketId, body, token(request));
  }

  @PostMapping("/{id}/comments")
  public ResponseEntity<TicketCommentResponse> addComment(
      @PathVariable("id") Long ticketId,
      @Valid @RequestBody TicketCommentCreateRequest body,
      HttpServletRequest request) {
    TicketCommentResponse created = ticketService.addComment(ticketId, body, token(request));
    return ResponseEntity.status(HttpStatus.CREATED).body(created);
  }
}
