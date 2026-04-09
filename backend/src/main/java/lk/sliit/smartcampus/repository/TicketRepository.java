package lk.sliit.smartcampus.repository;

import java.time.LocalDateTime;
import lk.sliit.smartcampus.entity.Ticket;
import lk.sliit.smartcampus.enums.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TicketRepository
    extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

  // check if ticket ref already exists in the system
  boolean existsByTicketRefIgnoreCase(String ticketRef);

  // count tickets for a specific resource and category since a given date
  // this is used by the pattern detection feature to find recurring issues
  long countByResource_ResourceIdAndCategoryAndCreatedAtAfter(
      Long resourceId, TicketCategory category, LocalDateTime since);
}
