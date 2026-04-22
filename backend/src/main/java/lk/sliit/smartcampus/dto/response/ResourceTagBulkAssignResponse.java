package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceTagBulkAssignResponse {
  private int totalResourceIds;
  private int totalTagIds;
  private int mappingsCreated;
  private int duplicatesSkipped;
  private List<ResourceTagBulkAssignFailedItem> failed;
  private List<String> messages;
}
