package lk.sliit.smartcampus.controller;

import java.time.LocalDate;
import lk.sliit.smartcampus.dto.response.StatusSchedulingOverviewResponse;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lk.sliit.smartcampus.service.StatusSchedulingOverviewService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/status-schedules")
public class StatusSchedulingOverviewController {

  private final StatusSchedulingOverviewService overviewService;

  public StatusSchedulingOverviewController(StatusSchedulingOverviewService overviewService) {
    this.overviewService = overviewService;
  }

  @GetMapping("/overview")
  public StatusSchedulingOverviewResponse getOverview(
      @RequestParam(required = false) String search,
      @RequestParam(required = false) ResourceType resourceType,
      @RequestParam(required = false) String building,
      @RequestParam(required = false) ScheduledStatus status,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) {
    return overviewService.getOverview(search, resourceType, building, status, fromDate, toDate);
  }
}

