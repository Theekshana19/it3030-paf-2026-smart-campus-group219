package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.request.CommentCreateRequest;
import lk.sliit.smartcampus.dto.response.CommentResponse;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.entity.TicketComment;
import lk.sliit.smartcampus.exception.CommentNotFoundException;
import lk.sliit.smartcampus.exception.CommentOwnershipException;
import lk.sliit.smartcampus.exception.TicketNotFoundException;
import lk.sliit.smartcampus.mapper.TicketCommentMapper;
import lk.sliit.smartcampus.repository.TicketCommentRepository;
import lk.sliit.smartcampus.repository.TicketRepository;
import lk.sliit.smartcampus.service.NotificationService;
import lk.sliit.smartcampus.service.TicketCommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// this service manages comments on incident tickets
// it handles creating, editing, and deleting comments
// with ownership checks to make sure only the author can modify their comment
@Service
@Transactional
public class TicketCommentServiceImpl implements TicketCommentService {

  private final TicketCommentRepository commentRepository;
  private final TicketRepository ticketRepository;
  private final TicketCommentMapper commentMapper;
  private final NotificationService notificationService;

  public TicketCommentServiceImpl(
      TicketCommentRepository commentRepository,
      TicketRepository ticketRepository,
      TicketCommentMapper commentMapper,
      NotificationService notificationService) {
    this.commentRepository = commentRepository;
    this.ticketRepository = ticketRepository;
    this.commentMapper = commentMapper;
    this.notificationService = notificationService;
  }

  // any user or staff member can add a comment to a ticket
  @Override
  public CommentResponse addComment(Long ticketId, CommentCreateRequest request) {
    Ticket ticket = ticketRepository.findById(ticketId)
        .orElseThrow(() -> new TicketNotFoundException(ticketId));

    LocalDateTime now = LocalDateTime.now();
    TicketComment comment = TicketComment.builder()
        .ticket(ticket)
        .authorEmail(request.getAuthorEmail().trim())
        .authorName(request.getAuthorName().trim())
        .commentText(request.getCommentText().trim())
        .isEdited(false)
        .isActive(true)
        .createdAt(now)
        .updatedAt(now)
        .build();

    TicketComment saved = commentRepository.save(comment);
    notificationService.notifyNewComment(ticket, saved);
    return commentMapper.toResponse(saved);
  }

  // get all active comments for a ticket sorted by creation time
  @Override
  @Transactional(readOnly = true)
  public List<CommentResponse> getCommentsByTicket(Long ticketId) {
    return commentRepository
        .findByTicket_TicketIdAndIsActiveTrueOrderByCreatedAtAsc(ticketId)
        .stream()
        .map(commentMapper::toResponse)
        .toList();
  }

  // only the person who wrote the comment can edit it
  // editing marks the comment as edited and updates the timestamp
  @Override
  public CommentResponse updateComment(Long ticketId, Long commentId,
      String authorEmail, String newText) {

    TicketComment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new CommentNotFoundException(commentId));

    // check if the person trying to edit is the original author
    if (!comment.getAuthorEmail().equalsIgnoreCase(authorEmail)) {
      throw new CommentOwnershipException(
          "You can only edit your own comments");
    }

    comment.setCommentText(newText.trim());
    comment.setIsEdited(true);
    comment.setUpdatedAt(LocalDateTime.now());

    TicketComment saved = commentRepository.save(comment);
    return commentMapper.toResponse(saved);
  }

  // the original author can delete their own comment
  // admin users can also delete any comment (checked by passing admin email)
  // we do a soft delete by setting is_active to false
  @Override
  public void deleteComment(Long ticketId, Long commentId, String requesterEmail) {
    TicketComment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new CommentNotFoundException(commentId));

    // allow deletion if requester is the author or an admin
    // for now we allow anyone to delete since auth is not implemented yet
    // when auth module is integrated, we will add proper role checking here
    if (!comment.getAuthorEmail().equalsIgnoreCase(requesterEmail)) {
      throw new CommentOwnershipException(
          "You can only delete your own comments");
    }

    comment.setIsActive(false);
    comment.setUpdatedAt(LocalDateTime.now());
    commentRepository.save(comment);
  }
}
