package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RecentChangeItemResponse {
  private String id;
  private String type;
  private String title;
  private String description;
  private LocalDateTime occurredAt;
  private String actor;
}
