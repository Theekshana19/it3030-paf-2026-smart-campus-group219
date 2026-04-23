package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.NotificationResponse;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.entity.TicketComment;

public interface NotificationService {

  List<NotificationResponse> getCurrentUserNotifications(Long userId);

  void markAsRead(Long notificationId, Long userId);

  void markAllAsRead(Long userId);

  long getUnreadCount(Long userId);

  void notifyBookingUpdate(Booking booking);

  void notifyTicketUpdate(Ticket ticket);

  void notifyNewComment(Ticket ticket, TicketComment comment);
}
