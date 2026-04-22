package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.entity.Notification;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.exception.NotificationNotFoundException;
import lk.sliit.smartcampus.repository.NotificationRepository;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

  private final NotificationRepository notificationRepository;
  private final UserRepository userRepository;

  public NotificationServiceImpl(
      NotificationRepository notificationRepository, UserRepository userRepository) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public List<NotificationResponse> getCurrentUserNotifications(String googleToken) {
    Long userId = resolveCurrentUserId(googleToken);
    return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public void markAsRead(Long notificationId, String googleToken) {
    Long userId = resolveCurrentUserId(googleToken);
    Notification notification =
        notificationRepository
            .findById(notificationId)
            .filter(item -> item.getUser().getUserId().equals(userId))
            .orElseThrow(() -> new NotificationNotFoundException(notificationId));

    if (!Boolean.TRUE.equals(notification.getIsRead())) {
      notification.setIsRead(true);
      notification.setReadAt(LocalDateTime.now());
      notificationRepository.save(notification);
    }
  }

  @Override
  public void markAllAsRead(String googleToken) {
    Long userId = resolveCurrentUserId(googleToken);
    List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    LocalDateTime now = LocalDateTime.now();
    boolean hasChanges = false;
    for (Notification notification : notifications) {
      if (!Boolean.TRUE.equals(notification.getIsRead())) {
        notification.setIsRead(true);
        notification.setReadAt(now);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      notificationRepository.saveAll(notifications);
    }
  }

  private Long resolveCurrentUserId(String googleToken) {
    ParsedGoogleToken tokenData = parseGoogleToken(googleToken);
    User currentUser =
        userRepository
            .findByGoogleSub(tokenData.sub())
            .orElseThrow(() -> new IllegalArgumentException("User not found for the provided token"));
    return currentUser.getUserId();
  }

  private ParsedGoogleToken parseGoogleToken(String googleToken) {
    String trimmed = googleToken == null ? "" : googleToken.trim();
    if (trimmed.isEmpty()) {
      throw new IllegalArgumentException("googleToken is required");
    }

    String[] parts = trimmed.split("\\|", -1);
    String sub = parts[0].trim();
    if (sub.isEmpty()) {
      throw new IllegalArgumentException("googleToken must include a subject");
    }

    return new ParsedGoogleToken(sub);
  }

  private record ParsedGoogleToken(String sub) {}

  private NotificationResponse toResponse(Notification entity) {
    return NotificationResponse.builder()
        .notificationId(entity.getNotificationId())
        .type(entity.getType())
        .title(entity.getTitle())
        .message(entity.getMessage())
        .isRead(entity.getIsRead())
        .readAt(entity.getReadAt())
        .createdAt(entity.getCreatedAt())
        .build();
  }
}

