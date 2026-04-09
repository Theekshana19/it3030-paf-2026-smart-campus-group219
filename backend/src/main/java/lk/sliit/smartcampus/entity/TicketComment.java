package lk.sliit.smartcampus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// this entity represents a comment on a ticket
// users and staff can add comments to discuss the issue
// only the original author can edit their own comment
@Entity
@Table(name = "TicketComments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketComment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "CommentId")
  private Long commentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TicketId", nullable = false)
  private Ticket ticket;

  @Column(name = "AuthorEmail", nullable = false, length = 150)
  private String authorEmail;

  @Column(name = "AuthorName", nullable = false, length = 100)
  private String authorName;

  @Column(name = "CommentText", nullable = false, length = 2000)
  private String commentText;

  @Column(name = "IsEdited", nullable = false)
  private Boolean isEdited;

  @Column(name = "IsActive", nullable = false)
  private Boolean isActive;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "UpdatedAt", nullable = false)
  private LocalDateTime updatedAt;
}
