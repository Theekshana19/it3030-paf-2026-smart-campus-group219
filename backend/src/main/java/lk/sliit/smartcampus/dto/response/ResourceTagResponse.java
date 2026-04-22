package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceTagResponse {

  private Long tagId;
  private String tagName;
  private String tagColor;
  private String description;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  /** Number of resources mapped to this tag; null when not computed. */
  private Integer usageCount;
}

