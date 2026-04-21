package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotNull;
import lk.sliit.smartcampus.enums.TicketStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketStatusUpdateRequest {

  @NotNull(message = "status is required")
  private TicketStatus status;
}
