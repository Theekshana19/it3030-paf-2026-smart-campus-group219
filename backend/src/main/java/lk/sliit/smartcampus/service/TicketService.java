package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.request.TicketCommentCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketCreateRequest;
import lk.sliit.smartcampus.dto.request.TicketStatusUpdateRequest;
import lk.sliit.smartcampus.dto.response.TicketCommentResponse;
import lk.sliit.smartcampus.dto.response.TicketResponse;

public interface TicketService {

  TicketResponse create(TicketCreateRequest request, String googleToken);

  List<TicketResponse> listMine(String googleToken);

  TicketResponse getById(Long ticketId, String googleToken);

  TicketResponse updateStatus(Long ticketId, TicketStatusUpdateRequest request, String googleToken);

  TicketCommentResponse addComment(Long ticketId, TicketCommentCreateRequest request, String googleToken);
}
