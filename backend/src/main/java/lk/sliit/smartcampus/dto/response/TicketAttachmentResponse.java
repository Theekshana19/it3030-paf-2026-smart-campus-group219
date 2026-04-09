package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketAttachmentResponse {

  private Long attachmentId;
  private String fileName;
  private Long fileSize;
  private String contentType;
  private LocalDateTime createdAt;
}
