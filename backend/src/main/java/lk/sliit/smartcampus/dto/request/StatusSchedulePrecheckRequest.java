package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusSchedulePrecheckRequest {

  @NotEmpty private List<Long> resourceIds;

  @NotNull private LocalDate scheduleDate;

  @NotNull private LocalTime startTime;

  @NotNull private LocalTime endTime;
}
