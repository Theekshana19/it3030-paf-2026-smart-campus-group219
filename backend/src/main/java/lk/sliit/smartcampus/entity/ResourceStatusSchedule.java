package lk.sliit.smartcampus.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ResourceStatusSchedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceStatusSchedule {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ScheduleId")
  private Long scheduleId;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "ResourceId", nullable = false)
  private Resource resource;

  @Column(name = "ScheduleDate", nullable = false)
  private LocalDate scheduleDate;

  @Column(name = "StartTime", nullable = false)
  private LocalTime startTime;

  @Column(name = "EndTime", nullable = false)
  private LocalTime endTime;

  @Enumerated(EnumType.STRING)
  @Column(name = "ScheduledStatus", nullable = false, length = 30)
  private ScheduledStatus scheduledStatus;

  @Column(name = "ReasonNote", length = 300)
  private String reasonNote;

  @Column(name = "IsActive", nullable = false)
  private Boolean isActive;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "UpdatedAt", nullable = false)
  private LocalDateTime updatedAt;
}

