package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.TicketAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketAttachmentRepository extends JpaRepository<TicketAttachment, Long> {

  // find all attachments belonging to a specific ticket
  List<TicketAttachment> findByTicket_TicketId(Long ticketId);

  // count how many attachments a ticket already has
  // we use this to enforce the maximum of 3 images per ticket
  long countByTicket_TicketId(Long ticketId);
}
