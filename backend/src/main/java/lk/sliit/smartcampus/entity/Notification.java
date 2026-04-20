package lk.sliit.smartcampus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lk.sliit.smartcampus.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "NotificationId")
  private Long notificationId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "UserId", nullable = false)
  private User user;

  @Enumerated(EnumType.STRING)
  @Column(name = "Type", nullable = false, length = 30)
  private NotificationType type;

  @Column(name = "Title", nullable = false, length = 150)
  private String title;

  @Column(name = "Message", nullable = false, length = 1000)
  private String message;

  @Column(name = "IsRead", nullable = false)
  private Boolean isRead;

  @Column(name = "ReadAt")
  private LocalDateTime readAt;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;
}

