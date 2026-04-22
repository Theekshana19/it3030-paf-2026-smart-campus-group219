package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BatchScheduleCreatedItem {
  private Long resourceId;
  private Long scheduleId;
}
