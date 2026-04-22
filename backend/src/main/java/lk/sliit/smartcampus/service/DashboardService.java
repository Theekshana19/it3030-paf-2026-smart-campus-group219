package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.DashboardOverviewResponse;
import lk.sliit.smartcampus.dto.response.DashboardRecentChangesResponse;
import lk.sliit.smartcampus.dto.response.DashboardResponse;
import lk.sliit.smartcampus.dto.response.RecentChangeItemResponse;
import lk.sliit.smartcampus.dto.response.ResourceDistributionItemResponse;

public interface DashboardService {
  DashboardResponse getDashboard();

  DashboardOverviewResponse getOverview();

  List<ResourceDistributionItemResponse> getResourceDistribution();

  List<RecentChangeItemResponse> getRecentChanges();

  DashboardRecentChangesResponse getRecentChanges(Integer page, Integer size);
}
