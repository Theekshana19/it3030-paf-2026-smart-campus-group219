package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BulkStatusScheduleRequest {

  @NotEmpty private List<Long> resourceIds;

  @NotNull private LocalDate scheduleDate;

  @NotNull private LocalTime startTime;

  @NotNull private LocalTime endTime;

  @NotNull private ScheduledStatus scheduledStatus;

  /** Optional; max length enforced in service if needed */
  private String reasonNote;

  /** Accepted for forward compatibility; no-op until notifications module exists */
  private Boolean notifyAffectedUsers;
}
