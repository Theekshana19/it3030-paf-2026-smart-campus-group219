package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceDistributionItemResponse {
  private String resourceType;
  private String label;
  private long count;
}
