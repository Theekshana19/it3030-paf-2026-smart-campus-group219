package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

// this response tells the frontend whether a resource has recurring issues
// the pattern detection checks the last 30 days for similar tickets
@Getter
@Builder
public class PatternAlertResponse {

  private String resourceName;
  private String category;
  private Integer ticketCount;
  private Boolean isRecurring;
  private String recommendation;
}
