package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UntaggedResourceListResponse {
  private List<UntaggedResourceSummaryResponse> items;
  private long totalItems;
  private int page;
  private int size;
  private int totalPages;
}
