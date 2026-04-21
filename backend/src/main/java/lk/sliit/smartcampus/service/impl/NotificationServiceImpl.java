package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.entity.Notification;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.NotificationType;
import lk.sliit.smartcampus.exception.NotificationNotFoundException;
import lk.sliit.smartcampus.repository.NotificationRepository;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.security.GoogleTokenResolutionService;
import lk.sliit.smartcampus.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

  private final NotificationRepository notificationRepository;
  private final UserRepository userRepository;
  private final GoogleTokenResolutionService tokenResolutionService;

  public NotificationServiceImpl(
      NotificationRepository notificationRepository,
      UserRepository userRepository,
      GoogleTokenResolutionService tokenResolutionService) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
    this.tokenResolutionService = tokenResolutionService;
  }

  @Override
  @Transactional(readOnly = true)
  public List<NotificationResponse> getCurrentUserNotifications(String googleToken) {
    Long userId = tokenResolutionService.resolveUser(googleToken).getUserId();
    return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public void markAsRead(Long notificationId, String googleToken) {
    Long userId = tokenResolutionService.resolveUser(googleToken).getUserId();
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
  public void delete(Long notificationId, String googleToken) {
    Long userId = tokenResolutionService.resolveUser(googleToken).getUserId();
    Notification notification =
        notificationRepository
            .findById(notificationId)
            .filter(item -> item.getUser().getUserId().equals(userId))
            .orElseThrow(() -> new NotificationNotFoundException(notificationId));
    notificationRepository.delete(notification);
  }

  @Override
  public void markAllAsRead(String googleToken) {
    Long userId = tokenResolutionService.resolveUser(googleToken).getUserId();
    List<Notification> notifications =
        notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
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

  @Override
  public void createForUser(Long userId, NotificationType type, String title, String message) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
    Notification entity =
        Notification.builder()
            .user(user)
            .type(type)
            .title(title)
            .message(message)
            .isRead(false)
            .createdAt(LocalDateTime.now())
            .build();
    notificationRepository.save(entity);
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
