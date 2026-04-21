package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.enums.NotificationType;

public interface NotificationService {

  List<NotificationResponse> getCurrentUserNotifications(String googleToken);

  void markAsRead(Long notificationId, String googleToken);

  void markAllAsRead(String googleToken);

  void delete(Long notificationId, String googleToken);

  void createForUser(Long userId, NotificationType type, String title, String message);
}

