package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.TicketAttachmentResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface TicketAttachmentService {

  TicketAttachmentResponse uploadAttachment(Long ticketId, MultipartFile file);

  List<TicketAttachmentResponse> getAttachmentsByTicket(Long ticketId);

  Resource downloadAttachment(Long ticketId, Long attachmentId);

  String getContentType(Long attachmentId);

  void deleteAttachment(Long ticketId, Long attachmentId);
}
