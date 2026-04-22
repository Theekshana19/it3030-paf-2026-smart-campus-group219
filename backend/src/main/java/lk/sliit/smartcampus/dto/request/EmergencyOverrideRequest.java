package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lk.sliit.smartcampus.enums.EmergencyEffectiveMode;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyOverrideRequest {

  @NotEmpty private List<Long> resourceIds;

  @NotNull private EmergencyEffectiveMode effectiveMode;

  /** Required when effectiveMode is SCHEDULED */
  private LocalDate scheduleDate;

  private LocalTime startTime;

  private LocalTime endTime;

  @NotNull private ScheduledStatus scheduledStatus;

  @NotBlank
  @Size(max = 300)
  private String reasonNote;

  /** Accepted for forward compatibility; no-op until notifications module exists */
  private Boolean notifyAffectedUsers;

  private Boolean highPriority;
}
