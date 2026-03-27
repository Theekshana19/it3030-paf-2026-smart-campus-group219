package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceResponse {

  private Long resourceId;
  private String resourceCode;
  private String resourceName;
  private ResourceType resourceType;
  private Integer capacity;
  private String building;
  private String floor;
  private String roomOrAreaIdentifier;
  private String fullLocationDescription;
  private LocalTime defaultAvailableFrom;
  private LocalTime defaultAvailableTo;
  private String workingDays;
  private ResourceStatus status;
  private String statusNotes;
  private String description;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // Kept for upcoming smart availability integration
  private String smartAvailabilityStatus;
  private String nextBookingTime;
  private Integer todayBookingCount;

  private List<ResourceTagResponse> tags;
}

