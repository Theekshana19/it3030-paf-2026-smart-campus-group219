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

// this entity stores metadata about image files attached to a ticket
// the actual file is saved on disk, this table keeps track of where it is
@Entity
@Table(name = "TicketAttachments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketAttachment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "AttachmentId")
  private Long attachmentId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "TicketId", nullable = false)
  private Ticket ticket;

  @Column(name = "FileName", nullable = false, length = 200)
  private String fileName;

  @Column(name = "StoredName", nullable = false, length = 300)
  private String storedName;

  @Column(name = "FilePath", nullable = false, length = 500)
  private String filePath;

  @Column(name = "FileSize", nullable = false)
  private Long fileSize;

  @Column(name = "ContentType", nullable = false, length = 100)
  private String contentType;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;
}
