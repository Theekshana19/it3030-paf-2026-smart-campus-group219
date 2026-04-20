package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CommentResponse {

  private Long commentId;
  private String authorEmail;
  private String authorName;
  private String commentText;
  private Boolean isEdited;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
