package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lk.sliit.smartcampus.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

  private Long bookingId;
  private Long resourceId;
  private String resourceName;
  private LocalDateTime startAt;
  private LocalDateTime endAt;
  private BookingStatus status;
  private String decisionNote;
  private LocalDateTime createdAt;
}
