package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lk.sliit.smartcampus.enums.TicketStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TicketResponse {

  private Long ticketId;
  private String ticketRef;

  // resource info (null if no resource linked)
  private Long resourceId;
  private String resourceName;
  private String resourceCode;

  private String locationDesc;
  private TicketCategory category;
  private String title;
  private String description;
  private TicketPriority priority;

  // reporter details
  private String reporterEmail;
  private String reporterName;
  private String contactPhone;
  private String contactMethod;

  // workflow details
  private TicketStatus ticketStatus;
  private String assignedToEmail;
  private String assignedToName;
  private LocalDateTime assignedAt;
  private String resolutionNotes;
  private LocalDateTime resolvedAt;
  private LocalDateTime closedAt;
  private String rejectReason;

  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // related data counts
  private Integer attachmentCount;
  private Integer commentCount;

  // attachments list (included in detail view)
  private List<TicketAttachmentResponse> attachments;
}
