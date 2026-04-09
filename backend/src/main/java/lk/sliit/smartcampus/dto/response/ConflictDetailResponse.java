package lk.sliit.smartcampus.dto.response;

import java.time.LocalTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;

// gives helpful details when a booking conflicts with existing ones
@Getter
@Builder
public class ConflictDetailResponse {

  private String conflictBookingRef;
  private LocalTime conflictStartTime;
  private LocalTime conflictEndTime;
  private String conflictPurpose;
  private Integer conflictAttendees;

  // suggestions for the user
  private String nextAvailableSlot;
  private List<String> alternativeResources;
}
