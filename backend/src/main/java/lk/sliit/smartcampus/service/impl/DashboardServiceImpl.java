package lk.sliit.smartcampus.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import lk.sliit.smartcampus.dto.response.DashboardOverviewResponse;
import lk.sliit.smartcampus.dto.response.DashboardRecentChangesResponse;
import lk.sliit.smartcampus.dto.response.DashboardResponse;
import lk.sliit.smartcampus.dto.response.RecentChangeItemResponse;
import lk.sliit.smartcampus.dto.response.ResourceDistributionItemResponse;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.enums.SmartAvailabilityStatus;
import lk.sliit.smartcampus.repository.ResourceRepository;
import lk.sliit.smartcampus.repository.ResourceStatusScheduleRepository;
import lk.sliit.smartcampus.service.DashboardService;
import lk.sliit.smartcampus.service.SmartAvailabilityService;
import lk.sliit.smartcampus.service.SmartAvailabilitySnapshot;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

  private static final int RECENT_LIMIT = 8;
  private static final int RECENT_FETCH_SIZE = 12;

  private final ResourceRepository resourceRepository;
  private final ResourceStatusScheduleRepository resourceStatusScheduleRepository;
  private final SmartAvailabilityService smartAvailabilityService;

  public DashboardServiceImpl(
      ResourceRepository resourceRepository,
      ResourceStatusScheduleRepository resourceStatusScheduleRepository,
      SmartAvailabilityService smartAvailabilityService) {
    this.resourceRepository = resourceRepository;
    this.resourceStatusScheduleRepository = resourceStatusScheduleRepository;
    this.smartAvailabilityService = smartAvailabilityService;
  }

  @Override
  public DashboardResponse getDashboard() {
    return DashboardResponse.builder()
        .overview(getOverview())
        .distribution(getResourceDistribution())
        .recentChanges(getRecentChanges(0, RECENT_LIMIT).getItems())
        .build();
  }

  @Override
  public DashboardOverviewResponse getOverview() {
    long total = resourceRepository.count();
    long active = resourceRepository.countByStatus(ResourceStatus.ACTIVE);
    long outOfService = resourceRepository.countByStatus(ResourceStatus.OUT_OF_SERVICE);

    long availableNow = 0;
    LocalDate today = LocalDate.now();
    Map<Long, List<ResourceStatusSchedule>> todaySchedulesByResourceId = new java.util.HashMap<>();
    for (ResourceStatusSchedule s : resourceStatusScheduleRepository.findByScheduleDate(today)) {
      Long resourceId = s.getResource().getResourceId();
      todaySchedulesByResourceId.computeIfAbsent(resourceId, key -> new ArrayList<>()).add(s);
    }
    for (Resource resource : resourceRepository.findAll()) {
      List<ResourceStatusSchedule> schedules =
          todaySchedulesByResourceId.getOrDefault(resource.getResourceId(), List.of());
      SmartAvailabilitySnapshot snap = smartAvailabilityService.compute(resource, schedules);
      if (SmartAvailabilityStatus.AVAILABLE_NOW.name().equals(snap.smartAvailabilityStatus())) {
        availableNow++;
      }
    }

    return DashboardOverviewResponse.builder()
        .totalResources(total)
        .activeResources(active)
        .outOfServiceResources(outOfService)
        .availableNowResources(availableNow)
        .build();
  }

  @Override
  public List<ResourceDistributionItemResponse> getResourceDistribution() {
    Map<ResourceType, Long> counts = new EnumMap<>(ResourceType.class);
    for (ResourceType t : ResourceType.values()) {
      counts.put(t, 0L);
    }
    for (Object[] row : resourceRepository.countByResourceType()) {
      ResourceType type = (ResourceType) row[0];
      long count = ((Number) row[1]).longValue();
      counts.put(type, count);
    }
    List<ResourceDistributionItemResponse> items = new ArrayList<>();
    for (ResourceType type : ResourceType.values()) {
      items.add(
          ResourceDistributionItemResponse.builder()
              .resourceType(type.name())
              .label(toLabel(type))
              .count(counts.getOrDefault(type, 0L))
              .build());
    }
    return items;
  }

  @Override
  public List<RecentChangeItemResponse> getRecentChanges() {
    return buildRecentFeed().stream().limit(RECENT_LIMIT).toList();
  }

  @Override
  public DashboardRecentChangesResponse getRecentChanges(Integer page, Integer size) {
    List<RecentChangeItemResponse> feed = buildRecentFeed();
    int safePage = Math.max(0, page);
    int safeSize = Math.max(1, size);
    int totalItems = feed.size();
    int totalPages = totalItems == 0 ? 0 : (int) Math.ceil((double) totalItems / safeSize);
    int fromIndex = Math.min(safePage * safeSize, totalItems);
    int toIndex = Math.min(fromIndex + safeSize, totalItems);
    List<RecentChangeItemResponse> items = feed.subList(fromIndex, toIndex);

    return DashboardRecentChangesResponse.builder()
        .items(items)
        .totalItems(totalItems)
        .page(safePage)
        .size(safeSize)
        .totalPages(totalPages)
        .build();
  }

  private List<RecentChangeItemResponse> buildRecentFeed() {
    List<RecentChangeItemResponse> feed = new ArrayList<>();

    List<Resource> recentUpdated =
        resourceRepository.findRecentUpdated(PageRequest.of(0, RECENT_FETCH_SIZE)).getContent();
    List<Resource> recentCreated =
        resourceRepository.findRecentCreated(PageRequest.of(0, RECENT_FETCH_SIZE)).getContent();
    List<ResourceStatusSchedule> recentSchedules =
        resourceStatusScheduleRepository.findRecentUpdated(PageRequest.of(0, RECENT_FETCH_SIZE)).getContent();

    for (Resource r : recentUpdated) {
      feed.add(
          RecentChangeItemResponse.builder()
              .id("resource-update-" + r.getResourceId())
              .type("RESOURCE_STATUS_UPDATED")
              .title(r.getResourceName() + " status updated")
              .description("Current status: " + r.getStatus().name())
              .occurredAt(r.getUpdatedAt())
              .actor("System")
              .build());
    }
    for (Resource r : recentCreated) {
      feed.add(
          RecentChangeItemResponse.builder()
              .id("resource-create-" + r.getResourceId())
              .type("RESOURCE_CREATED")
              .title("New resource added to catalogue")
              .description(r.getResourceCode() + " · " + r.getResourceName())
              .occurredAt(r.getCreatedAt())
              .actor("System")
              .build());
    }
    for (ResourceStatusSchedule s : recentSchedules) {
      LocalDateTime changedAt = s.getUpdatedAt() != null ? s.getUpdatedAt() : s.getCreatedAt();
      feed.add(
          RecentChangeItemResponse.builder()
              .id("schedule-update-" + s.getScheduleId())
              .type("SCHEDULE_UPDATED")
              .title("Maintenance schedule revised")
              .description(
                  s.getResource().getResourceName()
                      + " · "
                      + s.getScheduleDate()
                      + " "
                      + s.getStartTime()
                      + "-"
                      + s.getEndTime())
              .occurredAt(changedAt)
              .actor("System")
              .build());
    }

    LocalDateTime cutoff = LocalDateTime.now().minus(24, ChronoUnit.HOURS);
    feed = feed.stream().filter(i -> i.getOccurredAt() != null && !i.getOccurredAt().isBefore(cutoff)).toList();

    List<RecentChangeItemResponse> mutable = new ArrayList<>(feed);
    mutable.sort(
        Comparator.comparing(
                RecentChangeItemResponse::getOccurredAt, Comparator.nullsLast(Comparator.naturalOrder()))
            .reversed());
    return mutable;
  }

  private static String toLabel(ResourceType type) {
    return switch (type) {
      case LECTURE_HALL -> "Lecture Halls";
      case LAB -> "Labs";
      case MEETING_ROOM -> "Meeting Rooms";
      case EQUIPMENT -> "Equipment";
    };
  }
}
