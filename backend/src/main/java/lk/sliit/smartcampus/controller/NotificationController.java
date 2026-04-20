package lk.sliit.smartcampus.controller;

import java.util.List;
import jakarta.validation.constraints.NotBlank;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @GetMapping
  public List<NotificationResponse> getNotifications(
      @RequestParam @NotBlank(message = "googleToken is required") String googleToken) {
    return notificationService.getCurrentUserNotifications(googleToken);
  }

  @PatchMapping("/{id}/read")
  public ResponseEntity<Void> markAsRead(
      @PathVariable("id") Long notificationId,
      @RequestParam @NotBlank(message = "googleToken is required") String googleToken) {
    notificationService.markAsRead(notificationId, googleToken);
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/read-all")
  public ResponseEntity<Void> markAllAsRead(
      @RequestParam @NotBlank(message = "googleToken is required") String googleToken) {
    notificationService.markAllAsRead(googleToken);
    return ResponseEntity.noContent().build();
  }
}

