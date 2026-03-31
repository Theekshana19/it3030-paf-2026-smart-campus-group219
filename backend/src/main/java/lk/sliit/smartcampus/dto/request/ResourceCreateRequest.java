package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalTime;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceCreateRequest {

  @NotBlank
  @Size(max = 50)
  private String resourceCode;

  @NotBlank
  @Size(max = 150)
  private String resourceName;

  @NotNull
  private ResourceType resourceType;

  @Size(max = 80)
  private String equipmentSubtype;

  @Min(0)
  private Integer capacity;

  @Size(max = 100)
  private String building;

  @Size(max = 30)
  private String floor;

  @Size(max = 80)
  private String roomOrAreaIdentifier;

  @Size(max = 300)
  private String fullLocationDescription;

  private LocalTime defaultAvailableFrom;

  private LocalTime defaultAvailableTo;

  @Size(max = 120)
  private String workingDays;

  @NotNull
  private ResourceStatus status;

  @Size(max = 300)
  private String statusNotes;

  @Size(max = 1000)
  private String description;

  @NotNull
  private Boolean isActive;
}

