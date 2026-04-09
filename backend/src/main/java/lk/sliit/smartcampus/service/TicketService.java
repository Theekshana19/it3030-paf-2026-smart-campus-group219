package lk.sliit.smartcampus.service;

import lk.sliit.smartcampus.dto.request.TicketAssignRequest;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketRejectRequest;
import lk.sliit.smartcampus.dto.request.TicketResolveRequest;
import lk.sliit.smartcampus.dto.response.PatternAlertResponse;
import lk.sliit.smartcampus.dto.response.TicketListResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lk.sliit.smartcampus.enums.TicketStatus;

public interface TicketService {

  TicketResponse create(TicketCreateRequest request);

  TicketResponse update(Long ticketId, TicketCreateRequest request);

  void delete(Long ticketId);

  TicketResponse getById(Long ticketId);

  TicketListResponse findAll(
      Long resourceId, TicketStatus status, TicketPriority priority,
      TicketCategory category, String reporterEmail, String assignedToEmail,
      String search, Integer page, Integer size, String sortBy, String sortDir);

  TicketResponse assignTechnician(Long ticketId, TicketAssignRequest request);

  TicketResponse resolveTicket(Long ticketId, TicketResolveRequest request);

  TicketResponse closeTicket(Long ticketId);

  TicketResponse rejectTicket(Long ticketId, TicketRejectRequest request);

  PatternAlertResponse checkPattern(Long ticketId);
}
