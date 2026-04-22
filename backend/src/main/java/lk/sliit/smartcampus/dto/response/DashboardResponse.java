package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardResponse {
  private DashboardOverviewResponse overview;
  private List<ResourceDistributionItemResponse> distribution;
  private List<RecentChangeItemResponse> recentChanges;
}
