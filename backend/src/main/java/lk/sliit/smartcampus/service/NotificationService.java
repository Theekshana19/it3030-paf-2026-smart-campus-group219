package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;

public interface NotificationService {

  List<NotificationResponse> getCurrentUserNotifications(String googleToken);

  void markAsRead(Long notificationId, String googleToken);

  void markAllAsRead(String googleToken);
}

