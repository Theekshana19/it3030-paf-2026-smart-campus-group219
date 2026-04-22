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
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "resource_id")
  private Long resourceId;

  @Column(name = "resource_code", nullable = false, unique = true, length = 50)
  private String resourceCode;

  @Column(name = "resource_name", nullable = false, length = 150)
  private String resourceName;

  @Enumerated(EnumType.STRING)
  @Column(name = "resource_type", nullable = false, length = 30)
  private ResourceType resourceType;

  @Column(name = "equipment_subtype", length = 80)
  private String equipmentSubtype;

  @Column(name = "capacity")
  private Integer capacity;

  @Column(name = "building", nullable = false, length = 100)
  private String building;

  @Column(name = "floor", length = 30)
  private String floor;

  @Column(name = "room_or_area_identifier", length = 80)
  private String roomOrAreaIdentifier;

  @Column(name = "full_location_description", length = 300)
  private String fullLocationDescription;

  @Column(name = "default_available_from", nullable = false)
  private LocalTime defaultAvailableFrom;

  @Column(name = "default_available_to", nullable = false)
  private LocalTime defaultAvailableTo;

  @Column(name = "working_days", length = 120)
  private String workingDays;

  @Enumerated(EnumType.STRING)
  @Column(name = "status", nullable = false, length = 30)
  private ResourceStatus status;

  @Column(name = "status_notes", length = 300)
  private String statusNotes;

  @Column(name = "description", length = 1000)
  private String description;

  @Column(name = "is_active", nullable = false)
  private Boolean isActive;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;
}

