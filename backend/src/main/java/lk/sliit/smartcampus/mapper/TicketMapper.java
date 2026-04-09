package lk.sliit.smartcampus.mapper;

import java.util.Collections;
import java.util.List;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.response.TicketAttachmentResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.entity.TicketAttachment;
import org.springframework.stereotype.Component;

// this mapper converts between Ticket entities and DTOs
// it handles the resource relationship and attachment details
@Component
public class TicketMapper {

  // create a new ticket entity from the request data
  public Ticket toNewEntity(TicketCreateRequest request, Resource resource) {
    return Ticket.builder()
        .resource(resource)
        .locationDesc(request.getLocationDesc().trim())
        .category(request.getCategory())
        .title(request.getTitle().trim())
        .description(request.getDescription().trim())
        .priority(request.getPriority())
        .reporterEmail(request.getReporterEmail().trim())
        .reporterName(request.getReporterName().trim())
        .contactPhone(trimToNull(request.getContactPhone()))
        .contactMethod(trimToNull(request.getContactMethod()))
        .build();
  }

  // update an existing ticket entity with new values from the request
  public void applyUpdate(Ticket entity, TicketCreateRequest request, Resource resource) {
    entity.setResource(resource);
    entity.setLocationDesc(request.getLocationDesc().trim());
    entity.setCategory(request.getCategory());
    entity.setTitle(request.getTitle().trim());
    entity.setDescription(request.getDescription().trim());
    entity.setPriority(request.getPriority());
    entity.setReporterEmail(request.getReporterEmail().trim());
    entity.setReporterName(request.getReporterName().trim());
    entity.setContactPhone(trimToNull(request.getContactPhone()));
    entity.setContactMethod(trimToNull(request.getContactMethod()));
  }

  // convert ticket entity to response DTO
  // this includes resource info and attachment count
  public TicketResponse toResponse(Ticket entity) {
    Resource res = entity.getResource();
    List<TicketAttachment> attachmentList = entity.getAttachments();
    List<TicketAttachmentResponse> attachmentResponses = attachmentList != null
        ? attachmentList.stream().map(this::toAttachmentResponse).toList()
        : Collections.emptyList();

    int commentCount = entity.getComments() != null
        ? (int) entity.getComments().stream().filter(c -> Boolean.TRUE.equals(c.getIsActive())).count()
        : 0;

    return TicketResponse.builder()
        .ticketId(entity.getTicketId())
        .ticketRef(entity.getTicketRef())
        .resourceId(res != null ? res.getResourceId() : null)
        .resourceName(res != null ? res.getResourceName() : null)
        .resourceCode(res != null ? res.getResourceCode() : null)
        .locationDesc(entity.getLocationDesc())
        .category(entity.getCategory())
        .title(entity.getTitle())
        .description(entity.getDescription())
        .priority(entity.getPriority())
        .reporterEmail(entity.getReporterEmail())
        .reporterName(entity.getReporterName())
        .contactPhone(entity.getContactPhone())
        .contactMethod(entity.getContactMethod())
        .ticketStatus(entity.getTicketStatus())
        .assignedToEmail(entity.getAssignedToEmail())
        .assignedToName(entity.getAssignedToName())
        .assignedAt(entity.getAssignedAt())
        .resolutionNotes(entity.getResolutionNotes())
        .resolvedAt(entity.getResolvedAt())
        .closedAt(entity.getClosedAt())
        .rejectReason(entity.getRejectReason())
        .isActive(entity.getIsActive())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .attachmentCount(attachmentResponses.size())
        .commentCount(commentCount)
        .attachments(attachmentResponses)
        .build();
  }

  // convert a single attachment entity to response DTO
  public TicketAttachmentResponse toAttachmentResponse(TicketAttachment attachment) {
    return TicketAttachmentResponse.builder()
        .attachmentId(attachment.getAttachmentId())
        .fileName(attachment.getFileName())
        .fileSize(attachment.getFileSize())
        .contentType(attachment.getContentType())
        .createdAt(attachment.getCreatedAt())
        .build();
  }

  private String trimToNull(String value) {
    if (value == null) return null;
    String trimmed = value.trim();
    return trimmed.isEmpty() ? null : trimmed;
  }
}
