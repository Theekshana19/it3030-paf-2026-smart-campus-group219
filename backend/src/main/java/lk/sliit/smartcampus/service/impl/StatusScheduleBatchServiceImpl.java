package lk.sliit.smartcampus.service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import lk.sliit.smartcampus.dto.request.BulkStatusScheduleRequest;
import lk.sliit.smartcampus.dto.request.EmergencyOverrideRequest;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleCreateRequest;
import lk.sliit.smartcampus.dto.request.StatusSchedulePrecheckRequest;
import lk.sliit.smartcampus.dto.response.BatchScheduleCreatedItem;
import lk.sliit.smartcampus.dto.response.BatchScheduleSkippedItem;
import lk.sliit.smartcampus.dto.response.BulkStatusScheduleResponse;
import lk.sliit.smartcampus.dto.response.EmergencyOverrideResponse;
import lk.sliit.smartcampus.dto.response.ResourceStatusScheduleResponse;
import lk.sliit.smartcampus.dto.response.StatusSchedulePrecheckConflictItem;
import lk.sliit.smartcampus.dto.response.StatusSchedulePrecheckResponse;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.enums.EmergencyEffectiveMode;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.ResourceStatusScheduleRepository;
import lk.sliit.smartcampus.service.ResourceStatusScheduleService;
import lk.sliit.smartcampus.service.StatusScheduleBatchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatusScheduleBatchServiceImpl implements StatusScheduleBatchService {

  private final ResourceRepository resourceRepository;
  private final ResourceStatusScheduleRepository resourceStatusScheduleRepository;
  private final ResourceStatusScheduleService resourceStatusScheduleService;

  public StatusScheduleBatchServiceImpl(
      ResourceRepository resourceRepository,
      ResourceStatusScheduleRepository resourceStatusScheduleRepository,
      ResourceStatusScheduleService resourceStatusScheduleService) {
    this.resourceRepository = resourceRepository;
    this.resourceStatusScheduleRepository = resourceStatusScheduleRepository;
    this.resourceStatusScheduleService = resourceStatusScheduleService;
  }

  @Override
  @Transactional(readOnly = true)
  public StatusSchedulePrecheckResponse precheck(StatusSchedulePrecheckRequest request) {
    validateTimeWindow(request.getStartTime(), request.getEndTime());
    List<Long> distinctIds = distinctIds(request.getResourceIds());
    List<Long> noConflict = new ArrayList<>();
    List<StatusSchedulePrecheckConflictItem> conflicts = new ArrayList<>();

    for (Long resourceId : distinctIds) {
      if (!resourceRepository.existsById(resourceId)) {
        conflicts.add(
            StatusSchedulePrecheckConflictItem.builder()
                .resourceId(resourceId)
                .message("Resource not found")
                .build());
        continue;
      }
      if (hasOverlap(resourceId, request.getScheduleDate(), request.getStartTime(), request.getEndTime())) {
        conflicts.add(
            StatusSchedulePrecheckConflictItem.builder()
                .resourceId(resourceId)
                .message("Overlaps an existing active schedule on this date")
                .build());
      } else {
        noConflict.add(resourceId);
      }
    }

    return StatusSchedulePrecheckResponse.builder()
        .totalRequested(distinctIds.size())
        .noConflictResourceIds(noConflict)
        .conflicts(conflicts)
        .noConflictCount(noConflict.size())
        .conflictCount(conflicts.size())
        .build();
  }

  @Override
  public BulkStatusScheduleResponse bulkCreate(BulkStatusScheduleRequest request) {
    validateTimeWindow(request.getStartTime(), request.getEndTime());
    List<Long> distinctIds = distinctIds(request.getResourceIds());
    String reason = trimReason(request.getReasonNote(), 300);

    List<BatchScheduleCreatedItem> created = new ArrayList<>();
    List<BatchScheduleSkippedItem> skipped = new ArrayList<>();
    List<String> messages = new ArrayList<>();

    for (Long resourceId : distinctIds) {
      if (!resourceRepository.existsById(resourceId)) {
        skipped.add(
            BatchScheduleSkippedItem.builder()
                .resourceId(resourceId)
                .reason("Resource not found")
                .build());
        continue;
      }
      if (hasOverlap(resourceId, request.getScheduleDate(), request.getStartTime(), request.getEndTime())) {
        skipped.add(
            BatchScheduleSkippedItem.builder()
                .resourceId(resourceId)
                .reason("Overlaps an existing active schedule on this date")
                .build());
        continue;
      }
      try {
        ResourceStatusScheduleCreateRequest createRequest = new ResourceStatusScheduleCreateRequest();
        createRequest.setScheduleDate(request.getScheduleDate());
        createRequest.setStartTime(request.getStartTime());
        createRequest.setEndTime(request.getEndTime());
        createRequest.setScheduledStatus(request.getScheduledStatus());
        createRequest.setReasonNote(reason);
        createRequest.setIsActive(true);
        ResourceStatusScheduleResponse body =
            resourceStatusScheduleService.create(resourceId, createRequest);
        created.add(
            BatchScheduleCreatedItem.builder()
                .resourceId(resourceId)
                .scheduleId(body.getScheduleId())
                .build());
      } catch (RuntimeException ex) {
        skipped.add(
            BatchScheduleSkippedItem.builder()
                .resourceId(resourceId)
                .reason(ex.getMessage() != null ? ex.getMessage() : "Create failed")
                .build());
      }
    }

    messages.add(
        String.format(
            "Bulk complete: %d created, %d skipped out of %d requested.",
            created.size(), skipped.size(), distinctIds.size()));

    return BulkStatusScheduleResponse.builder()
        .totalRequested(distinctIds.size())
        .totalCreated(created.size())
        .totalSkipped(skipped.size())
        .created(created)
        .skipped(skipped)
        .messages(messages)
        .build();
  }

  @Override
  public EmergencyOverrideResponse emergencyOverride(EmergencyOverrideRequest request) {
    String baseReason = trimReason(request.getReasonNote(), 300);
    if (baseReason.isEmpty()) {
      throw new IllegalArgumentException("reasonNote is required for emergency override");
    }
    String reason = maybePrefixEmergency(baseReason, Boolean.TRUE.equals(request.getHighPriority()));

    LocalDate scheduleDate;
    LocalTime startTime;
    LocalTime endTime;

    if (request.getEffectiveMode() == EmergencyEffectiveMode.IMMEDIATE) {
      scheduleDate = LocalDate.now();
      startTime = LocalTime.now().withNano(0);
      endTime =
          request.getEndTime() != null ? request.getEndTime() : LocalTime.of(23, 59, 59);
      if (!startTime.isBefore(endTime)) {
        throw new IllegalArgumentException("End time must be after current time for immediate override");
      }
    } else {
      if (request.getScheduleDate() == null
          || request.getStartTime() == null
          || request.getEndTime() == null) {
        throw new IllegalArgumentException(
            "Scheduled emergency override requires scheduleDate, startTime, and endTime");
      }
      scheduleDate = request.getScheduleDate();
      startTime = request.getStartTime();
      endTime = request.getEndTime();
      validateTimeWindow(startTime, endTime);
    }

    List<Long> distinctIds = distinctIds(request.getResourceIds());
    List<BatchScheduleCreatedItem> created = new ArrayList<>();
    List<BatchScheduleSkippedItem> skipped = new ArrayList<>();
    List<String> messages = new ArrayList<>();

    for (Long resourceId : distinctIds) {
      if (!resourceRepository.existsById(resourceId)) {
        skipped.add(
            BatchScheduleSkippedItem.builder()
                .resourceId(resourceId)
                .reason("Resource not found")
                .build());
        continue;
      }
      if (hasOverlap(resourceId, scheduleDate, startTime, endTime)) {
        skipped.add(
            BatchScheduleSkippedItem.builder()
                .resourceId(resourceId)
                .reason("Overlaps an existing active schedule on this date")
                .build());
        continue;
      }
      try {
        ResourceStatusScheduleCreateRequest createRequest = new ResourceStatusScheduleCreateRequest();
        createRequest.setScheduleDate(scheduleDate);
        createRequest.setStartTime(startTime);
        createRequest.setEndTime(endTime);
        createRequest.setScheduledStatus(request.getScheduledStatus());
        createRequest.setReasonNote(reason);
        createRequest.setIsActive(true);
        ResourceStatusScheduleResponse body =
            resourceStatusScheduleService.create(resourceId, createRequest);
        created.add(
            BatchScheduleCreatedItem.builder()
                .resourceId(resourceId)
                .scheduleId(body.getScheduleId())
                .build());
      } catch (RuntimeException ex) {
        skipped.add(
            BatchScheduleSkippedItem.builder()
                .resourceId(resourceId)
                .reason(ex.getMessage() != null ? ex.getMessage() : "Create failed")
                .build());
      }
    }

    messages.add(
        String.format(
            "Emergency override complete: %d created, %d skipped out of %d requested.",
            created.size(), skipped.size(), distinctIds.size()));

    return EmergencyOverrideResponse.builder()
        .totalRequested(distinctIds.size())
        .totalCreated(created.size())
        .totalSkipped(skipped.size())
        .created(created)
        .skipped(skipped)
        .messages(messages)
        .build();
  }

  private static List<Long> distinctIds(List<Long> ids) {
    Set<Long> set = new LinkedHashSet<>();
    for (Long id : ids) {
      if (id != null) {
        set.add(id);
      }
    }
    return new ArrayList<>(set);
  }

  private static void validateTimeWindow(LocalTime start, LocalTime end) {
    if (start == null || end == null) {
      throw new IllegalArgumentException("startTime and endTime are required");
    }
    if (!start.isBefore(end)) {
      throw new IllegalArgumentException("startTime must be before endTime");
    }
  }

  private boolean hasOverlap(Long resourceId, LocalDate date, LocalTime start, LocalTime end) {
    List<ResourceStatusSchedule> existing =
        resourceStatusScheduleRepository.findByResource_ResourceIdAndScheduleDate(resourceId, date);
    for (ResourceStatusSchedule s : existing) {
      if (Boolean.FALSE.equals(s.getIsActive())) {
        continue;
      }
      LocalTime es = s.getStartTime();
      LocalTime ee = s.getEndTime();
      if (start.isBefore(ee) && end.isAfter(es)) {
        return true;
      }
    }
    return false;
  }

  private static String trimReason(String reason, int maxLen) {
    if (reason == null) {
      return "";
    }
    String t = reason.trim();
    if (t.length() > maxLen) {
      return t.substring(0, maxLen);
    }
    return t;
  }

  private static String maybePrefixEmergency(String reason, boolean highPriority) {
    if (!highPriority) {
      return reason;
    }
    if (reason.startsWith("[EMERGENCY]")) {
      return reason;
    }
    return "[EMERGENCY] " + reason;
  }
}
