package lk.sliit.smartcampus.mapper;

import lk.sliit.smartcampus.dto.response.CommentResponse;
import lk.sliit.smartcampus.entity.TicketComment;
import org.springframework.stereotype.Component;

// this mapper converts between TicketComment entities and response DTOs
@Component
public class TicketCommentMapper {

  public CommentResponse toResponse(TicketComment entity) {
    return CommentResponse.builder()
        .commentId(entity.getCommentId())
        .authorEmail(entity.getAuthorEmail())
        .authorName(entity.getAuthorName())
        .commentText(entity.getCommentText())
        .isEdited(entity.getIsEdited())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
