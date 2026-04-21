package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

  private Long ticketId;
  private Long userId;
  private String title;
  private String description;
  private TicketStatus status;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private List<TicketCommentResponse> comments;
}
