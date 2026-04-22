package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceTagBulkAssignFailedItem {
  private Long resourceId;
  private Long tagId;
  private String reason;
}
