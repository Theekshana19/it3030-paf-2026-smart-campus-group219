package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDecisionRequest {

  @NotNull(message = "approved is required")
  private Boolean approved;

  @Size(max = 500, message = "note must be at most 500 characters")
  private String note;
}
