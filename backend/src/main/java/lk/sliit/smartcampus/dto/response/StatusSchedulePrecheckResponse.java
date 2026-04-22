package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class StatusSchedulePrecheckResponse {
  private int totalRequested;
  private List<Long> noConflictResourceIds;
  private List<StatusSchedulePrecheckConflictItem> conflicts;
  private int noConflictCount;
  private int conflictCount;
}
