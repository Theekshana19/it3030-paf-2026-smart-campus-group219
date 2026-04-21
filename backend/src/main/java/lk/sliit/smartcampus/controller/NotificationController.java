package lk.sliit.smartcampus.controller;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.security.AuthTokenExtractor;
import lk.sliit.smartcampus.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/notifications")
public class NotificationController {

  private final NotificationService notificationService;
  private final AuthTokenExtractor authTokenExtractor;

  public NotificationController(
      NotificationService notificationService, AuthTokenExtractor authTokenExtractor) {
    this.notificationService = notificationService;
    this.authTokenExtractor = authTokenExtractor;
  }

  private String resolveToken(HttpServletRequest request, String googleTokenParam) {
    String fromHeader = authTokenExtractor.extract(request);
    if (!fromHeader.isBlank()) {
      return fromHeader;
    }
    if (googleTokenParam != null && !googleTokenParam.isBlank()) {
      return googleTokenParam.trim();
    }
    throw new IllegalArgumentException("Authentication token required (Authorization Bearer or googleToken)");
  }

  @GetMapping
  public List<NotificationResponse> getNotifications(
      HttpServletRequest request, @RequestParam(required = false) String googleToken) {
    return notificationService.getCurrentUserNotifications(resolveToken(request, googleToken));
  }

  @PatchMapping("/{id}/read")
  public ResponseEntity<Void> markAsRead(
      @PathVariable("id") Long notificationId,
      HttpServletRequest request,
      @RequestParam(required = false) String googleToken) {
    notificationService.markAsRead(notificationId, resolveToken(request, googleToken));
    return ResponseEntity.noContent().build();
  }

  @PatchMapping("/read-all")
  public ResponseEntity<Void> markAllAsRead(
      HttpServletRequest request, @RequestParam(required = false) String googleToken) {
    notificationService.markAllAsRead(resolveToken(request, googleToken));
    return ResponseEntity.noContent().build();
  }

  /**
   * DELETE /api/notifications/{id} — removes a notification for the current user. Returns 204 No Content.
   */
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(
      @PathVariable("id") Long notificationId,
      HttpServletRequest request,
      @RequestParam(required = false) String googleToken) {
    notificationService.delete(notificationId, resolveToken(request, googleToken));
    return ResponseEntity.noContent().build();
  }
}
