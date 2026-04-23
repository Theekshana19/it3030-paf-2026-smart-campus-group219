package lk.sliit.smartcampus.controller;

import java.util.List;
import java.util.Map;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.service.NotificationService;
import lk.sliit.smartcampus.util.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;
  private final SecurityUtils securityUtils;

  public NotificationController(NotificationService notificationService, SecurityUtils securityUtils) {
    this.notificationService = notificationService;
    this.securityUtils = securityUtils;
  }

  @GetMapping
  public List<NotificationResponse> getNotifications() {
    return notificationService.getCurrentUserNotifications(securityUtils.getCurrentUserId());
  }

  @GetMapping("/count")
  public Map<String, Long> getUnreadCount() {
    long count = notificationService.getUnreadCount(securityUtils.getCurrentUserId());
    return Map.of("unreadCount", count);
  }

  @PatchMapping("/{id}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable("id") Long notificationId) {
    notificationService.markAsRead(notificationId, securityUtils.getCurrentUserId());
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/read-all")
  public ResponseEntity<Void> markAllAsRead() {
    notificationService.markAllAsRead(securityUtils.getCurrentUserId());
    return ResponseEntity.noContent().build();
  }

  // DEBUG ENDPOINT - for testing purposes
  @GetMapping("/debug/all")
  public Map<String, Object> debugAllNotifications() {
    List<NotificationResponse> allNotifications = notificationService
        .getCurrentUserNotifications(securityUtils.getCurrentUserId());
    return Map.of(
        "userId", securityUtils.getCurrentUserId(),
        "notificationCount", allNotifications.size(),
        "notifications", allNotifications
    );
  }
}
