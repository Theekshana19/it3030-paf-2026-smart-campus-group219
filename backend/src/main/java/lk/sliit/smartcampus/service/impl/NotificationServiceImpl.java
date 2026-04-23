package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.entity.Notification;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.entity.TicketComment;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.BookingStatus;
import lk.sliit.smartcampus.enums.NotificationType;
import lk.sliit.smartcampus.enums.TicketStatus;
import lk.sliit.smartcampus.exception.NotificationNotFoundException;
import lk.sliit.smartcampus.repository.NotificationRepository;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.service.NotificationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

  private static final String YOUR_TICKET = "Your ticket ";

  private final NotificationRepository notificationRepository;
  private final UserRepository userRepository;

  public NotificationServiceImpl(
      NotificationRepository notificationRepository, UserRepository userRepository) {
    this.notificationRepository = notificationRepository;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public List<NotificationResponse> getCurrentUserNotifications(Long userId) {
    return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
        .map(this::toResponse)
        .toList();
  }

  @Override
  public void markAsRead(Long notificationId, Long userId) {
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
  public void markAllAsRead(Long userId) {
    List<Notification> notifications =
        notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    LocalDateTime now = LocalDateTime.now();
    boolean hasChanges = false;
    for (Notification n : notifications) {
      if (!Boolean.TRUE.equals(n.getIsRead())) {
        n.setIsRead(true);
        n.setReadAt(now);
        hasChanges = true;
      }
    }
    if (hasChanges) {
      notificationRepository.saveAll(notifications);
    }
  }

  @Override
  @Transactional(readOnly = true)
  public long getUnreadCount(Long userId) {
    return notificationRepository.countByUserUserIdAndIsReadFalse(userId);
  }

  @Override
  public void notifyBookingUpdate(Booking booking) {
    userRepository.findByEmailIgnoreCase(booking.getUserEmail()).ifPresent(user -> {
      String title;
      String message;
      if (booking.getBookingStatus() == BookingStatus.APPROVED) {
        title = "Booking Approved";
        message = "Your booking " + booking.getBookingRef()
            + " for " + booking.getResource().getResourceName() + " has been approved.";
      } else if (booking.getBookingStatus() == BookingStatus.REJECTED) {
        title = "Booking Rejected";
        String remark = booking.getAdminRemark() != null ? booking.getAdminRemark() : "No reason provided";
        message = "Your booking " + booking.getBookingRef()
            + " was rejected. Reason: " + remark;
      } else {
        return;
      }
      saveNotification(user, NotificationType.BOOKING, title, message);
    });
  }

  @Override
  public void notifyTicketUpdate(Ticket ticket) {
    userRepository.findByEmailIgnoreCase(ticket.getReporterEmail()).ifPresent(user -> {
      String title;
      String message;
      TicketStatus status = ticket.getTicketStatus();
      if (status == TicketStatus.IN_PROGRESS) {
        title = "Ticket In Progress";
        message = YOUR_TICKET + ticket.getTicketRef() + " is now being worked on.";
      } else if (status == TicketStatus.RESOLVED) {
        title = "Ticket Resolved";
        message = YOUR_TICKET + ticket.getTicketRef() + " has been resolved.";
      } else if (status == TicketStatus.CLOSED) {
        title = "Ticket Closed";
        message = YOUR_TICKET + ticket.getTicketRef() + " has been closed.";
      } else if (status == TicketStatus.REJECTED) {
        String reason = ticket.getRejectReason() != null ? ticket.getRejectReason() : "No reason provided";
        title = "Ticket Rejected";
        message = YOUR_TICKET + ticket.getTicketRef() + " was rejected. Reason: " + reason;
      } else {
        return;
      }
      saveNotification(user, NotificationType.TICKET, title, message);
    });
  }

  @Override
  public void notifyNewComment(Ticket ticket, TicketComment comment) {
    String commenterEmail = comment.getAuthorEmail();
    boolean commenterIsReporter = commenterEmail.equalsIgnoreCase(ticket.getReporterEmail());

    if (!commenterIsReporter) {
      // staff commented — notify the reporter
      userRepository.findByEmailIgnoreCase(ticket.getReporterEmail()).ifPresent(reporter ->
          saveNotification(reporter, NotificationType.TICKET,
              "New comment on your ticket",
              comment.getAuthorName() + " commented on your ticket " + ticket.getTicketRef() + ".")
      );
    } else if (ticket.getAssignedToEmail() != null) {
      // reporter replied — notify the assigned technician
      userRepository.findByEmailIgnoreCase(ticket.getAssignedToEmail()).ifPresent(tech ->
          saveNotification(tech, NotificationType.TICKET,
              "Owner replied on ticket",
              ticket.getReporterName() + " replied on ticket " + ticket.getTicketRef() + ".")
      );
    }
  }

  private void saveNotification(User user, NotificationType type, String title, String message) {
    Notification notification = Notification.builder()
        .user(user)
        .type(type)
        .title(title)
        .message(message)
        .isRead(false)
        .createdAt(LocalDateTime.now())
        .build();
    notificationRepository.save(notification);
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
