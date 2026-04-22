package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UntaggedResourceSummaryResponse {
  private Long resourceId;
  private String resourceName;
  private String resourceCode;
  private String building;
  private String floor;
  private String roomOrAreaIdentifier;
}
