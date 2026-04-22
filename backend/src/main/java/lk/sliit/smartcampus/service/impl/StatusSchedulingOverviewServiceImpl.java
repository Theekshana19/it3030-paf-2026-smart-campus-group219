package lk.sliit.smartcampus.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lk.sliit.smartcampus.dto.response.SchedulingOverviewItemResponse;
import lk.sliit.smartcampus.dto.response.SchedulingOverviewMetricsResponse;
import lk.sliit.smartcampus.dto.response.SchedulingPriorityAlertResponse;
import lk.sliit.smartcampus.dto.response.SchedulingRecentUpdateResponse;
import lk.sliit.smartcampus.dto.response.SchedulingTimelineItemResponse;
import lk.sliit.smartcampus.dto.response.StatusSchedulingOverviewResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lk.sliit.smartcampus.repository.ResourceStatusScheduleRepository;
import lk.sliit.smartcampus.service.StatusSchedulingOverviewService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class StatusSchedulingOverviewServiceImpl implements StatusSchedulingOverviewService {

  private static final DateTimeFormatter DATE_LABEL = DateTimeFormatter.ofPattern("MMM dd, yyyy", Locale.ENGLISH);
  private static final DateTimeFormatter TIME_LABEL = DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH);
  private static final DateTimeFormatter TIME_ONLY = DateTimeFormatter.ofPattern("HH:mm");

  private final ResourceStatusScheduleRepository repository;

  public StatusSchedulingOverviewServiceImpl(ResourceStatusScheduleRepository repository) {
    this.repository = repository;
  }

  @Override
  public StatusSchedulingOverviewResponse getOverview(
      String search,
      ResourceType resourceType,
      String building,
      ScheduledStatus status,
      LocalDate fromDate,
      LocalDate toDate) {
    List<ResourceStatusSchedule> schedules =
        repository.findForGlobalOverview(search, resourceType, building, status, fromDate, toDate);

    Map<Long, Boolean> conflictMap = buildConflictMap(schedules);
    LocalDateTime now = LocalDateTime.now();
    boolean defaultDateRange = fromDate == null && toDate == null;
    List<ResourceStatusSchedule> displaySchedules =
        defaultDateRange
            ? schedules.stream().filter(s -> isStillVisibleOnOverview(s, now)).toList()
            : schedules;
    List<SchedulingOverviewItemResponse> items =
        displaySchedules.stream().map(s -> toOverviewItem(s, conflictMap, now)).toList();

    SchedulingOverviewMetricsResponse metrics = toMetrics(items);
    List<SchedulingTimelineItemResponse> timeline = toTimeline(items, now);
    List<SchedulingPriorityAlertResponse> alerts = toAlerts(items);
    List<SchedulingRecentUpdateResponse> recentUpdates = toRecentUpdates(items);

    return StatusSchedulingOverviewResponse.builder()
        .items(items)
        .metrics(metrics)
        .timeline(timeline)
        .alerts(alerts)
        .recentUpdates(recentUpdates)
        .build();
  }

  /**
   * Drops schedule rows that are entirely in the past (before today, or today's window has ended).
   * Keeps future calendar dates and today's not-yet-ended windows.
   */
  private static boolean isStillVisibleOnOverview(ResourceStatusSchedule s, LocalDateTime now) {
    if (s.getScheduleDate() == null) {
      return true;
    }
    if (s.getScheduleDate().isBefore(now.toLocalDate())) {
      return false;
    }
    LocalDateTime windowEnd = LocalDateTime.of(s.getScheduleDate(), s.getEndTime());
    return now.isBefore(windowEnd);
  }

  /**
   * Half-open {@code [start, end)}. For OUT_OF_SERVICE, show ACTIVE once the window has ended (operational
   * state); future and in-window rows keep OUT_OF_SERVICE.
   */
  private static String effectiveTargetStatus(ResourceStatusSchedule schedule, LocalDateTime now) {
    if (!Boolean.TRUE.equals(schedule.getIsActive())) {
      return schedule.getScheduledStatus().name();
    }
    if (schedule.getScheduledStatus() != ScheduledStatus.OUT_OF_SERVICE) {
      return schedule.getScheduledStatus().name();
    }
    LocalDate d = schedule.getScheduleDate();
    if (d == null || schedule.getStartTime() == null || schedule.getEndTime() == null) {
      return schedule.getScheduledStatus().name();
    }
    LocalDateTime startDt = LocalDateTime.of(d, schedule.getStartTime());
    LocalDateTime endDt = LocalDateTime.of(d, schedule.getEndTime());
    if (!now.isBefore(startDt) && now.isBefore(endDt)) {
      return ScheduledStatus.OUT_OF_SERVICE.name();
    }
    if (!now.isBefore(endDt)) {
      return ScheduledStatus.ACTIVE.name();
    }
    return ScheduledStatus.OUT_OF_SERVICE.name();
  }

  private SchedulingOverviewItemResponse toOverviewItem(
      ResourceStatusSchedule schedule, Map<Long, Boolean> conflictMap, LocalDateTime now) {
    Resource resource = schedule.getResource();
    String start = schedule.getStartTime().format(TIME_ONLY);
    String end = schedule.getEndTime().format(TIME_ONLY);
    String locationLabel =
        String.join(
            ", ",
            List.of(
                nullable(resource.getBuilding()),
                nullable(resource.getFloor()),
                nullable(resource.getRoomOrAreaIdentifier())).stream().filter(s -> !s.isBlank()).toList());

    return SchedulingOverviewItemResponse.builder()
        .scheduleId(schedule.getScheduleId())
        .resourceId(resource.getResourceId())
        .resourceName(resource.getResourceName())
        .resourceCode(resource.getResourceCode())
        .resourceType(resource.getResourceType().name())
        .building(nullable(resource.getBuilding()))
        .locationLabel(locationLabel.isBlank() ? nullable(resource.getBuilding()) : locationLabel)
        .scheduleDate(schedule.getScheduleDate())
        .scheduleDateLabel(schedule.getScheduleDate().format(DATE_LABEL))
        .startTime(start)
        .endTime(end)
        .timeRangeLabel(
            schedule.getStartTime().format(TIME_LABEL) + " - " + schedule.getEndTime().format(TIME_LABEL))
        .targetStatus(effectiveTargetStatus(schedule, now))
        .reasonNote(nullable(schedule.getReasonNote()))
        .isActive(Boolean.TRUE.equals(schedule.getIsActive()))
        .hasConflict(Boolean.TRUE.equals(conflictMap.get(schedule.getScheduleId())))
        .updatedAt(schedule.getUpdatedAt())
        .build();
  }

  private SchedulingOverviewMetricsResponse toMetrics(List<SchedulingOverviewItemResponse> items) {
    LocalDate today = LocalDate.now();
    long scheduledToday = items.stream().filter(i -> today.equals(i.getScheduleDate())).count();
    long upcomingMaintenance =
        items.stream()
            .filter(i -> i.getScheduleDate() != null && !i.getScheduleDate().isBefore(today))
            .filter(i -> ScheduledStatus.OUT_OF_SERVICE.name().equals(i.getTargetStatus()))
            .count();
    long outOfService =
        items.stream().filter(i -> ScheduledStatus.OUT_OF_SERVICE.name().equals(i.getTargetStatus())).count();
    long conflicts = items.stream().filter(i -> Boolean.TRUE.equals(i.getHasConflict())).count();
    return SchedulingOverviewMetricsResponse.builder()
        .scheduledToday(scheduledToday)
        .upcomingMaintenance(upcomingMaintenance)
        .outOfService(outOfService)
        .conflictsDetected(conflicts)
        .build();
  }

  private List<SchedulingTimelineItemResponse> toTimeline(
      List<SchedulingOverviewItemResponse> items, LocalDateTime now) {
    LocalDate today = LocalDate.now();
    return items.stream()
        .filter(i -> today.equals(i.getScheduleDate()))
        .filter(
            i -> {
              LocalDateTime endDt =
                  LocalDateTime.of(i.getScheduleDate(), LocalTime.parse(i.getEndTime()));
              return now.isBefore(endDt);
            })
        .sorted(Comparator.comparing(SchedulingOverviewItemResponse::getStartTime))
        .limit(6)
        .map(
            i ->
                SchedulingTimelineItemResponse.builder()
                    .id(i.getScheduleId() + "-" + i.getResourceId())
                    .time(LocalTime.parse(i.getStartTime()).format(TIME_LABEL))
                    .title(
                        i.getResourceName()
                            + (ScheduledStatus.OUT_OF_SERVICE.name().equals(i.getTargetStatus())
                                ? " Maintenance Start"
                                : " Status Change"))
                    .subtitle(
                        (i.getReasonNote() != null && !i.getReasonNote().isBlank())
                            ? i.getReasonNote()
                            : i.getLocationLabel())
                    .active(Boolean.TRUE.equals(i.getHasConflict()))
                    .build())
        .toList();
  }

  private List<SchedulingPriorityAlertResponse> toAlerts(List<SchedulingOverviewItemResponse> items) {
    List<SchedulingPriorityAlertResponse> alerts = new ArrayList<>();
    items.stream()
        .filter(i -> Boolean.TRUE.equals(i.getHasConflict()))
        .limit(3)
        .forEach(
            i ->
                alerts.add(
                    SchedulingPriorityAlertResponse.builder()
                        .id("conflict-" + i.getScheduleId())
                        .level("high")
                        .title("Booking Conflict")
                        .message(
                            i.getResourceName()
                                + " has overlapping windows on "
                                + i.getScheduleDateLabel()
                                + ".")
                        .actionLabel("Resolve now")
                        .build()));

    if (alerts.size() < 4) {
      items.stream()
          .filter(i -> ScheduledStatus.OUT_OF_SERVICE.name().equals(i.getTargetStatus()))
          .filter(i -> i.getReasonNote() == null || i.getReasonNote().isBlank())
          .limit(4L - alerts.size())
          .forEach(
              i ->
                  alerts.add(
                      SchedulingPriorityAlertResponse.builder()
                          .id("context-" + i.getScheduleId())
                          .level("medium")
                          .title("Missing context")
                          .message(
                              i.getResourceName()
                                  + " is marked out of service without a reason note.")
                          .actionLabel(null)
                          .build()));
    }
    return alerts;
  }

  private List<SchedulingRecentUpdateResponse> toRecentUpdates(List<SchedulingOverviewItemResponse> items) {
    DateTimeFormatter updatedFmt = DateTimeFormatter.ofPattern("MMM dd, yyyy hh:mm a", Locale.ENGLISH);
    return items.stream()
        .filter(i -> i.getUpdatedAt() != null)
        .sorted(Comparator.comparing(SchedulingOverviewItemResponse::getUpdatedAt).reversed())
        .limit(4)
        .map(
            i -> {
              LocalDateTime updatedAt = i.getUpdatedAt();
              return SchedulingRecentUpdateResponse.builder()
                  .id("recent-" + i.getScheduleId())
                  .title(
                      (ScheduledStatus.OUT_OF_SERVICE.name().equals(i.getTargetStatus()) ? "Modified: " : "Updated: ")
                          + i.getResourceName())
                  .timeLabel(updatedAt.format(updatedFmt))
                  .description(
                      (i.getReasonNote() != null && !i.getReasonNote().isBlank())
                          ? i.getReasonNote()
                          : i.getScheduleDateLabel() + " " + i.getTimeRangeLabel())
                  .actor("System")
                  .build();
            })
        .toList();
  }

  private Map<Long, Boolean> buildConflictMap(List<ResourceStatusSchedule> schedules) {
    Map<Long, Boolean> conflicts = new HashMap<>();
    Map<String, List<ResourceStatusSchedule>> byResourceDate = new HashMap<>();
    for (ResourceStatusSchedule schedule : schedules) {
      String key = schedule.getResource().getResourceId() + ":" + schedule.getScheduleDate();
      byResourceDate.computeIfAbsent(key, k -> new ArrayList<>()).add(schedule);
    }
    byResourceDate
        .values()
        .forEach(
            group -> {
              group.sort(Comparator.comparing(ResourceStatusSchedule::getStartTime));
              for (int i = 1; i < group.size(); i++) {
                ResourceStatusSchedule prev = group.get(i - 1);
                ResourceStatusSchedule cur = group.get(i);
                if (cur.getStartTime().isBefore(prev.getEndTime())) {
                  conflicts.put(prev.getScheduleId(), true);
                  conflicts.put(cur.getScheduleId(), true);
                }
              }
            });
    return conflicts;
  }

  private String nullable(String value) {
    return value == null ? "" : value;
  }
}

