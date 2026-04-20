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
  public List<NotificationResponse> getCurrentUserNotifications() {
    Long userId = resolveCurrentUserId();
    return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public void markAsRead(Long notificationId) {
    Long userId = resolveCurrentUserId();
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
  public void markAllAsRead() {
    Long userId = resolveCurrentUserId();
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

  private Long resolveCurrentUserId() {
    User currentUser =
        userRepository
            .findAll()
            .stream()
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("No users found in the system"));
    return currentUser.getUserId();
  }

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

