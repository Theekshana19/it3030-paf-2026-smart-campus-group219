package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SchedulingRecentUpdateResponse {
  private String id;
  private String title;
  private String timeLabel;
  private String description;
  private String actor;
}

