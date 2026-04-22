package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceTagOverviewResponse {
  private List<TagMostUsedItemResponse> mostUsedTags;
  private long untaggedResourceCount;
  private long totalActiveTags;
}
