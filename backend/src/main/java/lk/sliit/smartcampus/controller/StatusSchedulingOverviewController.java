package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.time.LocalDate;
import lk.sliit.smartcampus.dto.request.BulkStatusScheduleRequest;
import lk.sliit.smartcampus.dto.request.EmergencyOverrideRequest;
import lk.sliit.smartcampus.dto.request.StatusSchedulePrecheckRequest;
import lk.sliit.smartcampus.dto.response.BulkStatusScheduleResponse;
import lk.sliit.smartcampus.dto.response.EmergencyOverrideResponse;
import lk.sliit.smartcampus.dto.response.StatusSchedulePrecheckResponse;
import lk.sliit.smartcampus.dto.response.StatusSchedulingOverviewResponse;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lk.sliit.smartcampus.service.StatusScheduleBatchService;
import lk.sliit.smartcampus.service.StatusSchedulingOverviewService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/status-schedules")
public class StatusSchedulingOverviewController {

  private final StatusSchedulingOverviewService overviewService;
  private final StatusScheduleBatchService statusScheduleBatchService;

  public StatusSchedulingOverviewController(
      StatusSchedulingOverviewService overviewService,
      StatusScheduleBatchService statusScheduleBatchService) {
    this.overviewService = overviewService;
    this.statusScheduleBatchService = statusScheduleBatchService;
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

  @PostMapping("/precheck")
  public ResponseEntity<StatusSchedulePrecheckResponse> precheck(
      @Valid @RequestBody StatusSchedulePrecheckRequest request) {
    return ResponseEntity.ok(statusScheduleBatchService.precheck(request));
  }

  @PostMapping("/bulk")
  public ResponseEntity<BulkStatusScheduleResponse> bulk(@Valid @RequestBody BulkStatusScheduleRequest request) {
    return ResponseEntity.ok(statusScheduleBatchService.bulkCreate(request));
  }

  @PostMapping("/emergency-override")
  public ResponseEntity<EmergencyOverrideResponse> emergencyOverride(
      @Valid @RequestBody EmergencyOverrideRequest request) {
    return ResponseEntity.ok(statusScheduleBatchService.emergencyOverride(request));
  }
}
