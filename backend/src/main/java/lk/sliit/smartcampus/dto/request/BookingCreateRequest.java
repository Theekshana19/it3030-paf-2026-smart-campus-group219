package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingCreateRequest {

  @NotNull(message = "resourceId is required")
  private Long resourceId;

  @NotNull(message = "startAt is required")
  private LocalDateTime startAt;

  @NotNull(message = "endAt is required")
  private LocalDateTime endAt;
}
