package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

// this request is used when admin rejects a ticket
// a reason must be provided so the reporter knows why
@Getter
@Setter
public class TicketRejectRequest {

  @NotBlank
  @Size(max = 500)
  private String rejectReason;
}
