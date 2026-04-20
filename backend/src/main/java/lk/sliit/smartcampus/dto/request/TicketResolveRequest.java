package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

// this request is used when a technician resolves a ticket
// they must provide resolution notes explaining what was done
@Getter
@Setter
public class TicketResolveRequest {

  @NotBlank
  @Size(max = 2000)
  private String resolutionNotes;
}
