package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.TicketComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketCommentRepository extends JpaRepository<TicketComment, Long> {

  List<TicketComment> findByTicketTicketIdOrderByCreatedAtAsc(Long ticketId);
}
