package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;

public interface NotificationService {

  List<NotificationResponse> getCurrentUserNotifications();

  void markAsRead(Long notificationId);

  void markAllAsRead();
}

