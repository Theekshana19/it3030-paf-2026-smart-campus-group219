package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SchedulingTimelineItemResponse {
  private String id;
  private String time;
  private String title;
  private String subtitle;
  private Boolean active;
}

