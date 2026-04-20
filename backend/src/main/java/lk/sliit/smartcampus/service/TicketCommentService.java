package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.request.CommentCreateRequest;
import lk.sliit.smartcampus.dto.response.CommentResponse;

public interface TicketCommentService {

  CommentResponse addComment(Long ticketId, CommentCreateRequest request);

  List<CommentResponse> getCommentsByTicket(Long ticketId);

  CommentResponse updateComment(Long ticketId, Long commentId,
      String authorEmail, String newText);

  void deleteComment(Long ticketId, Long commentId, String requesterEmail);
}
