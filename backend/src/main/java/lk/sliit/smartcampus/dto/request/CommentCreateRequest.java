package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentCreateRequest {

  @NotBlank
  @Size(max = 150)
  private String authorEmail;

  @NotBlank
  @Size(max = 100)
  private String authorName;

  @NotBlank
  @Size(max = 2000)
  private String commentText;
}
