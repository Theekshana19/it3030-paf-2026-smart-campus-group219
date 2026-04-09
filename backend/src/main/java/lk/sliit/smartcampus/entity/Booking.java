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
import lk.sliit.smartcampus.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "BookingId")
  private Long bookingId;

  @Column(name = "BookingRef", nullable = false, unique = true, length = 30)
  private String bookingRef;

  // link to the resource being booked
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "ResourceId", nullable = false)
  private Resource resource;

  @Column(name = "UserEmail", nullable = false, length = 150)
  private String userEmail;

  @Column(name = "UserName", nullable = false, length = 100)
  private String userName;

  @Column(name = "BookingDate", nullable = false)
  private LocalDate bookingDate;

  @Column(name = "StartTime", nullable = false)
  private LocalTime startTime;

  @Column(name = "EndTime", nullable = false)
  private LocalTime endTime;

  @Column(name = "Purpose", nullable = false, length = 500)
  private String purpose;

  @Column(name = "ExpectedCount")
  private Integer expectedCount;

  @Enumerated(EnumType.STRING)
  @Column(name = "BookingStatus", nullable = false, length = 20)
  private BookingStatus bookingStatus;

  // admin fills this when approving or rejecting
  @Column(name = "AdminRemark", length = 500)
  private String adminRemark;

  @Column(name = "ReviewedBy", length = 150)
  private String reviewedBy;

  @Column(name = "ReviewedAt")
  private LocalDateTime reviewedAt;

  @Column(name = "IsActive", nullable = false)
  private Boolean isActive;

  @Column(name = "CreatedAt", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "UpdatedAt", nullable = false)
  private LocalDateTime updatedAt;
}
