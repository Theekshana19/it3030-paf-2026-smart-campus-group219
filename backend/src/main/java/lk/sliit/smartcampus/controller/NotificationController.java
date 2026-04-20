package lk.sliit.smartcampus.controller;

import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.service.NotificationService;
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

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public List<NotificationResponse> getNotifications() {
    return notificationService.getCurrentUserNotifications();
  }

  @PatchMapping("/{id}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable("id") Long notificationId) {
    notificationService.markAsRead(notificationId);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/read-all")
  public ResponseEntity<Void> markAllAsRead() {
    notificationService.markAllAsRead();
    return ResponseEntity.noContent().build();
  }
}

