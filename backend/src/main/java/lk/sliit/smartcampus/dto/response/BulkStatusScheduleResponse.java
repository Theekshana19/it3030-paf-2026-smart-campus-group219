package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BulkStatusScheduleResponse {
  private int totalRequested;
  private int totalCreated;
  private int totalSkipped;
  private List<BatchScheduleCreatedItem> created;
  private List<BatchScheduleSkippedItem> skipped;
  private List<String> messages;
}
