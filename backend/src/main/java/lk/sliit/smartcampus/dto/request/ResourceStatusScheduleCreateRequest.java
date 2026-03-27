package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceStatusScheduleCreateRequest {

  @NotNull
  private LocalDate scheduleDate;

  @NotNull
  private LocalTime startTime;

  @NotNull
  private LocalTime endTime;

  @NotNull
  private ScheduledStatus scheduledStatus;

  @Size(max = 300)
  private String reasonNote;

  @NotNull
  private Boolean isActive;
}

