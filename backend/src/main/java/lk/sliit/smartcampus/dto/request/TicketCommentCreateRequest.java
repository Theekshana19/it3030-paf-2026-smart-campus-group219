package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCommentCreateRequest {

  @NotBlank(message = "body is required")
  @Size(max = 2000, message = "body must be at most 2000 characters")
  private String body;
}
