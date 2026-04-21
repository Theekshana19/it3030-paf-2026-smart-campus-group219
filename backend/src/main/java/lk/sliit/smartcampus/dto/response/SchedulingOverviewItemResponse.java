package lk.sliit.smartcampus.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SchedulingOverviewItemResponse {
  private Long scheduleId;
  private Long resourceId;
  private String resourceName;
  private String resourceCode;
  private String resourceType;
  private String building;
  private String locationLabel;
  private LocalDate scheduleDate;
  private String scheduleDateLabel;
  private String startTime;
  private String endTime;
  private String timeRangeLabel;
  private String targetStatus;
  private String reasonNote;
  private Boolean isActive;
  private Boolean hasConflict;
  private LocalDateTime updatedAt;
}

