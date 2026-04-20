package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

// this request is used when admin assigns a technician to a ticket
@Getter
@Setter
public class TicketAssignRequest {

  @NotBlank
  @Size(max = 150)
  private String assignedToEmail;

  @NotBlank
  @Size(max = 100)
  private String assignedToName;
}
