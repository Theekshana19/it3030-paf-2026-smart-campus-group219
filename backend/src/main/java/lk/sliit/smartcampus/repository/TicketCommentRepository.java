package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

  // find all active comments for a ticket, ordered by created date
  List<TicketComment> findByTicket_TicketIdAndIsActiveTrueOrderByCreatedAtAsc(Long ticketId);
}
