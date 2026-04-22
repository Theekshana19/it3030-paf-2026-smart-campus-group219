package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SchedulingPriorityAlertResponse {
  private String id;
  private String level;
  private String title;
  private String message;
  private String actionLabel;
}

