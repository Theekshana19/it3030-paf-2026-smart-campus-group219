package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentResponse {

  private Long commentId;
  private Long userId;
  private String authorDisplayName;
  private String body;
  private LocalDateTime createdAt;
}
