package lk.sliit.smartcampus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ResourceId")
  private Long resourceId;

  @Column(name = "ResourceCode", nullable = false, unique = true, length = 50)
  private String resourceCode;

  @Column(name = "ResourceName", nullable = false, length = 150)
  private String resourceName;

  @Enumerated(EnumType.STRING)
  @Column(name = "ResourceType", nullable = false, length = 30)
  private ResourceType resourceType;

  @Column(name = "Capacity")
  private Integer capacity;

  @Column(name = "Building", length = 100)
  private String building;

  @Column(name = "Floor", length = 30)
  private String floor;

  @Column(name = "RoomOrAreaIdentifier", length = 80)
  private String roomOrAreaIdentifier;

  @Column(name = "FullLocationDescription", length = 300)
  private String fullLocationDescription;

  @Column(name = "DefaultAvailableFrom")
  private LocalTime defaultAvailableFrom;

  @Column(name = "DefaultAvailableTo")
  private LocalTime defaultAvailableTo;

  @Column(name = "WorkingDays", length = 120)
  private String workingDays;

  @Enumerated(EnumType.STRING)
  @Column(name = "Status", nullable = false, length = 30)
  private ResourceStatus status;

  @Column(name = "StatusNotes", length = 300)
  private String statusNotes;

  @Column(name = "Description", length = 1000)
  private String description;

  @Column(name = "IsActive", nullable = false)
  private Boolean isActive;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "UpdatedAt", nullable = false)
  private LocalDateTime updatedAt;
}

