package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.request.TicketCommentCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketStatusUpdateRequest;
import lk.sliit.smartcampus.dto.response.TicketCommentResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.entity.TicketComment;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.NotificationType;
import lk.sliit.smartcampus.enums.TicketStatus;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.exception.TicketNotFoundException;
import lk.sliit.smartcampus.repository.TicketCommentRepository;
import lk.sliit.smartcampus.repository.TicketRepository;
import lk.sliit.smartcampus.security.GoogleTokenResolutionService;
import lk.sliit.smartcampus.service.NotificationService;
import lk.sliit.smartcampus.service.TicketService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TicketServiceImpl implements TicketService {

  private final TicketRepository ticketRepository;
  private final TicketCommentRepository ticketCommentRepository;
  private final GoogleTokenResolutionService tokenResolutionService;
  private final NotificationService notificationService;

  public TicketServiceImpl(
      TicketRepository ticketRepository,
      TicketCommentRepository ticketCommentRepository,
      GoogleTokenResolutionService tokenResolutionService,
      NotificationService notificationService) {
    this.ticketRepository = ticketRepository;
    this.ticketCommentRepository = ticketCommentRepository;
    this.tokenResolutionService = tokenResolutionService;
    this.notificationService = notificationService;
  }

  @Override
  public TicketResponse create(TicketCreateRequest request, String googleToken) {
    User user = tokenResolutionService.resolveUser(googleToken);
    LocalDateTime now = LocalDateTime.now();
    Ticket ticket =
        Ticket.builder()
            .user(user)
            .title(request.getTitle().trim())
            .description(request.getDescription() != null ? request.getDescription().trim() : null)
            .status(TicketStatus.OPEN)
            .createdAt(now)
            .updatedAt(now)
            .build();
    Ticket saved = ticketRepository.save(ticket);
    return toResponse(saved, List.of());
  }

  @Override
  @Transactional(readOnly = true)
  public List<TicketResponse> listMine(String googleToken) {
    User user = tokenResolutionService.resolveUser(googleToken);
    return ticketRepository.findByUserUserIdOrderByUpdatedAtDesc(user.getUserId()).stream()
        .map(t -> toResponse(t, List.of()))
        .toList();
  }

  @Override
  @Transactional(readOnly = true)
  public TicketResponse getById(Long ticketId, String googleToken) {
    User actor = tokenResolutionService.resolveUser(googleToken);
    Ticket ticket =
        ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
    assertCanView(ticket, actor);
    List<TicketComment> comments =
        ticketCommentRepository.findByTicketTicketIdOrderByCreatedAtAsc(ticketId);
    return toResponse(ticket, comments);
  }

  @Override
  public TicketResponse updateStatus(Long ticketId, TicketStatusUpdateRequest request, String googleToken) {
    User actor = tokenResolutionService.resolveUser(googleToken);
    Ticket ticket =
        ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
    assertCanChangeStatus(ticket, actor);
    TicketStatus previous = ticket.getStatus();
    TicketStatus next = request.getStatus();
    if (previous == next) {
      return toResponse(
          ticket, ticketCommentRepository.findByTicketTicketIdOrderByCreatedAtAsc(ticketId));
    }
    ticket.setStatus(next);
    ticket.setUpdatedAt(LocalDateTime.now());
    ticketRepository.save(ticket);

    Long ownerId = ticket.getUser().getUserId();
    notificationService.createForUser(
        ownerId,
        NotificationType.TICKET_STATUS_CHANGED,
        "Ticket status updated",
        "Ticket \""
            + ticket.getTitle()
            + "\" changed from "
            + previous
            + " to "
            + next
            + ".");

    List<TicketComment> comments =
        ticketCommentRepository.findByTicketTicketIdOrderByCreatedAtAsc(ticketId);
    return toResponse(ticket, comments);
  }

  @Override
  public TicketCommentResponse addComment(Long ticketId, TicketCommentCreateRequest request, String googleToken) {
    User actor = tokenResolutionService.resolveUser(googleToken);
    Ticket ticket =
        ticketRepository.findById(ticketId).orElseThrow(() -> new TicketNotFoundException(ticketId));
    assertCanView(ticket, actor);

    LocalDateTime now = LocalDateTime.now();
    TicketComment comment =
        TicketComment.builder()
            .ticket(ticket)
            .user(actor)
            .body(request.getBody().trim())
            .createdAt(now)
            .build();
    TicketComment saved = ticketCommentRepository.save(comment);

    ticket.setUpdatedAt(now);
    ticketRepository.save(ticket);

    Long ownerId = ticket.getUser().getUserId();
    if (!ownerId.equals(actor.getUserId())) {
      notificationService.createForUser(
          ownerId,
          NotificationType.TICKET_COMMENT,
          "New comment on your ticket",
          actor.getDisplayName()
              + " commented on \""
              + ticket.getTitle()
              + "\": "
              + truncate(saved.getBody(), 200));
    }

    return toCommentResponse(saved);
  }

  private void assertCanView(Ticket ticket, User actor) {
    if (ticket.getUser().getUserId().equals(actor.getUserId())) {
      return;
    }
    if (actor.getRole() == UserRole.ADMIN || actor.getRole() == UserRole.TECHNICIAN) {
      return;
    }
    throw new AccessDeniedException("You cannot access this ticket");
  }

  private void assertCanChangeStatus(Ticket ticket, User actor) {
    if (ticket.getUser().getUserId().equals(actor.getUserId())) {
      return;
    }
    if (actor.getRole() == UserRole.ADMIN || actor.getRole() == UserRole.TECHNICIAN) {
      return;
    }
    throw new AccessDeniedException("You cannot update this ticket status");
  }

  private static String truncate(String s, int max) {
    if (s == null) return "";
    return s.length() <= max ? s : s.substring(0, max) + "…";
  }

  private TicketResponse toResponse(Ticket ticket, List<TicketComment> comments) {
    List<TicketCommentResponse> mapped =
        comments.stream().map(this::toCommentResponse).toList();
    return TicketResponse.builder()
        .ticketId(ticket.getTicketId())
        .userId(ticket.getUser().getUserId())
        .title(ticket.getTitle())
        .description(ticket.getDescription())
        .status(ticket.getStatus())
        .createdAt(ticket.getCreatedAt())
        .updatedAt(ticket.getUpdatedAt())
        .comments(mapped)
        .build();
  }

  private TicketCommentResponse toCommentResponse(TicketComment c) {
    return TicketCommentResponse.builder()
        .commentId(c.getCommentId())
        .userId(c.getUser().getUserId())
        .authorDisplayName(c.getUser().getDisplayName())
        .body(c.getBody())
        .createdAt(c.getCreatedAt())
        .build();
  }
}
