package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResourceListResponse {

  private List<ResourceResponse> items;
  private Long totalItems;
}

