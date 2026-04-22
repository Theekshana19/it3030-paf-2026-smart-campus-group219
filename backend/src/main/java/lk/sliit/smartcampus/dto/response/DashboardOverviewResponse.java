package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardOverviewResponse {
  private long totalResources;
  private long activeResources;
  private long outOfServiceResources;
  private long availableNowResources;
}
