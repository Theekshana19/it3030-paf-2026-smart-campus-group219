package lk.sliit.smartcampus.dto.request;

import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceFilterRequest {

  private ResourceType type;
  private Integer minCapacity;
  private String building;
  private ResourceStatus status;
  private String tag;
  private String search;
}

