package lk.sliit.smartcampus.entity;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lk.sliit.smartcampus.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// this entity represents a maintenance or incident ticket
// it tracks the full lifecycle from OPEN to CLOSED
@Entity
@Table(name = "Tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "TicketId")
  private Long ticketId;

  @Column(name = "TicketRef", nullable = false, unique = true, length = 30)
  private String ticketRef;

  // the resource that has the issue (optional, can be null)
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ResourceId")
  private Resource resource;

  @Column(name = "LocationDesc", nullable = false, length = 200)
  private String locationDesc;

  @Enumerated(EnumType.STRING)
  @Column(name = "Category", nullable = false, length = 50)
  private TicketCategory category;

  @Column(name = "Title", nullable = false, length = 200)
  private String title;

  @Column(name = "Description", nullable = false, length = 2000)
  private String description;

  @Enumerated(EnumType.STRING)
  @Column(name = "Priority", nullable = false, length = 20)
  private TicketPriority priority;

  @Column(name = "ReporterEmail", nullable = false, length = 150)
  private String reporterEmail;

  @Column(name = "ReporterName", nullable = false, length = 100)
  private String reporterName;

  @Column(name = "ContactPhone", length = 20)
  private String contactPhone;

  @Column(name = "ContactMethod", length = 30)
  private String contactMethod;

  @Enumerated(EnumType.STRING)
  @Column(name = "TicketStatus", nullable = false, length = 20)
  private TicketStatus ticketStatus;

  // technician assignment details
  @Column(name = "AssignedToEmail", length = 150)
  private String assignedToEmail;

  @Column(name = "AssignedToName", length = 100)
  private String assignedToName;

  @Column(name = "AssignedAt")
  private LocalDateTime assignedAt;

  // resolution details filled by technician
  @Column(name = "ResolutionNotes", length = 2000)
  private String resolutionNotes;

  @Column(name = "ResolvedAt")
  private LocalDateTime resolvedAt;

  @Column(name = "ClosedAt")
  private LocalDateTime closedAt;

  @Column(name = "RejectReason", length = 500)
  private String rejectReason;

  @Column(name = "IsActive", nullable = false)
  private Boolean isActive;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "UpdatedAt", nullable = false)
  private LocalDateTime updatedAt;

  @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<TicketAttachment> attachments;

  @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  private List<TicketComment> comments;
}
