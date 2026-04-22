package lk.sliit.smartcampus.controller;

import java.util.List;
import lk.sliit.smartcampus.dto.response.DashboardOverviewResponse;
import lk.sliit.smartcampus.dto.response.DashboardRecentChangesResponse;
import lk.sliit.smartcampus.dto.response.DashboardResponse;
import lk.sliit.smartcampus.dto.response.RecentChangeItemResponse;
import lk.sliit.smartcampus.dto.response.ResourceDistributionItemResponse;
import lk.sliit.smartcampus.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
  public DashboardRecentChangesResponse getRecentChanges(
      @RequestParam(defaultValue = "0") Integer page,
      @RequestParam(defaultValue = "5") Integer size) {
    if (page < 0) {
      throw new IllegalArgumentException("page must be greater than or equal to 0");
    }
    if (size < 1 || size > 20) {
      throw new IllegalArgumentException("size must be between 1 and 20");
    }
    return dashboardService.getRecentChanges(page, size);
  }
}
