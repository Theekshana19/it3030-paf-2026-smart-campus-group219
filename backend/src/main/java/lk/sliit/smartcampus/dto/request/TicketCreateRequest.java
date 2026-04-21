package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCreateRequest {

  @NotBlank(message = "title is required")
  @Size(max = 200, message = "title must be at most 200 characters")
  private String title;

  @Size(max = 2000, message = "description must be at most 2000 characters")
  private String description;
}
