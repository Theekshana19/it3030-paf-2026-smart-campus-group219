package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StatusSchedulingOverviewResponse {
  private List<SchedulingOverviewItemResponse> items;
  private SchedulingOverviewMetricsResponse metrics;
  private List<SchedulingTimelineItemResponse> timeline;
  private List<SchedulingPriorityAlertResponse> alerts;
  private List<SchedulingRecentUpdateResponse> recentUpdates;
}

