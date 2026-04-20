package lk.sliit.smartcampus.dto.response;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BookingListResponse {

  private List<BookingResponse> items;
  private Long totalItems;
  private Integer page;
  private Integer size;
  private Integer totalPages;
}
