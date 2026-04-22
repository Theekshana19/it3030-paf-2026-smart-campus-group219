package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BatchScheduleSkippedItem {
  private Long resourceId;
  private String reason;
}
