package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.util.List;
import lk.sliit.smartcampus.dto.request.CommentCreateRequest;
import lk.sliit.smartcampus.dto.response.CommentResponse;
import lk.sliit.smartcampus.service.TicketCommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// this controller handles comment operations on tickets
// users and staff can add comments to discuss issues
// only the original author can edit or delete their own comments
@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
public class TicketCommentController {

  private final TicketCommentService commentService;

  public TicketCommentController(TicketCommentService commentService) {
    this.commentService = commentService;
  }

  // add a new comment to a ticket
  @PostMapping
  public ResponseEntity<CommentResponse> addComment(
      @PathVariable Long ticketId,
      @Valid @RequestBody CommentCreateRequest request) {
    CommentResponse body = commentService.addComment(ticketId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  // get all active comments for a ticket
  @GetMapping
  public List<CommentResponse> listComments(@PathVariable Long ticketId) {
    return commentService.getCommentsByTicket(ticketId);
  }

  // edit an existing comment (only the author can do this)
  @PutMapping("/{commentId}")
  public CommentResponse updateComment(
      @PathVariable Long ticketId,
      @PathVariable Long commentId,
      @RequestParam String authorEmail,
      @RequestBody String newText) {
    return commentService.updateComment(ticketId, commentId, authorEmail, newText);
  }

  // delete a comment (only the author or admin can do this)
  @DeleteMapping("/{commentId}")
  public ResponseEntity<Void> deleteComment(
      @PathVariable Long ticketId,
      @PathVariable Long commentId,
      @RequestParam String requesterEmail) {
    commentService.deleteComment(ticketId, commentId, requesterEmail);
    return ResponseEntity.noContent().build();
  }
}
