package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

  List<Ticket> findByUserUserIdOrderByUpdatedAtDesc(Long userId);
}
