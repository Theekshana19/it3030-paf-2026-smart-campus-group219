package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SchedulingOverviewMetricsResponse {
  private long scheduledToday;
  private long upcomingMaintenance;
  private long outOfService;
  private long conflictsDetected;
}

