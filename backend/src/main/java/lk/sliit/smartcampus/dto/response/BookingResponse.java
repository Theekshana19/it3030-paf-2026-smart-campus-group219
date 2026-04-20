package lk.sliit.smartcampus.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lk.sliit.smartcampus.enums.BookingStatus;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingResponse {

  private Long bookingId;
  private String bookingRef;

  // resource info
  private Long resourceId;
  private String resourceName;
  private String resourceCode;
  private String resourceType;
  private String building;
  private Integer capacity;

  // booking details
  private String userEmail;
  private String userName;
  private LocalDate bookingDate;
  private LocalTime startTime;
  private LocalTime endTime;
  private String purpose;
  private Integer expectedCount;

  // status info
  private BookingStatus bookingStatus;
  private String adminRemark;
  private String reviewedBy;
  private LocalDateTime reviewedAt;

  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
