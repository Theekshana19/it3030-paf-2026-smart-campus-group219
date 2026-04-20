package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lk.sliit.smartcampus.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponse {

  private Long notificationId;
  private NotificationType type;
  private String title;
  private String message;
  private Boolean isRead;
  private LocalDateTime readAt;
  private LocalDateTime createdAt;
}

