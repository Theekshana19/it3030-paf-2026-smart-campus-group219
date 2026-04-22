package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TagMostUsedItemResponse {
  private Long tagId;
  private String tagName;
  private String tagColor;
  private long usageCount;
}
