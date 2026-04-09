package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingCreateRequest {

  @NotNull
  private Long resourceId;

  @NotBlank
  @Size(max = 150)
  private String userEmail;

  @NotBlank
  @Size(max = 100)
  private String userName;

  @NotNull
  private LocalDate bookingDate;

  @NotNull
  private LocalTime startTime;

  @NotNull
  private LocalTime endTime;

  @NotBlank
  @Size(max = 500)
  private String purpose;

  @Min(0)
  private Integer expectedCount;
}
