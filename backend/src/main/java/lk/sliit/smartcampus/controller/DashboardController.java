package lk.sliit.smartcampus.controller;

import java.util.List;
import lk.sliit.smartcampus.dto.response.DashboardOverviewResponse;
import lk.sliit.smartcampus.dto.response.DashboardResponse;
import lk.sliit.smartcampus.dto.response.RecentChangeItemResponse;
import lk.sliit.smartcampus.dto.response.ResourceDistributionItemResponse;
import lk.sliit.smartcampus.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

  private final DashboardService dashboardService;

  @GetMapping
  public DashboardResponse getDashboard() {
    return dashboardService.getDashboard();
  }

  @GetMapping("/overview")
  public DashboardOverviewResponse getOverview() {
    return dashboardService.getOverview();
  }

  @GetMapping("/resource-distribution")
  public List<ResourceDistributionItemResponse> getResourceDistribution() {
    return dashboardService.getResourceDistribution();
  }

  @GetMapping("/recent-changes")
  public List<RecentChangeItemResponse> getRecentChanges() {
    return dashboardService.getRecentChanges();
  }
}
