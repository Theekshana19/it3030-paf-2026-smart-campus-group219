package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingReviewRequest {

  // true = approve, false = reject
  @NotNull
  private Boolean approved;

  @Size(max = 500)
  private String adminRemark;

  @NotBlank
  @Size(max = 150)
  private String reviewerEmail;
}
