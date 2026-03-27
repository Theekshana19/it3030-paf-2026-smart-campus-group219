package lk.sliit.smartcampus.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceStatusScheduleResponse {

  private Long scheduleId;
  private Long resourceId;
  private LocalDate scheduleDate;
  private LocalTime startTime;
  private LocalTime endTime;
  private ScheduledStatus scheduledStatus;
  private String reasonNote;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}

