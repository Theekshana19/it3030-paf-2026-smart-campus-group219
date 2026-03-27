package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceTagCreateRequest {

  @NotBlank
  @Size(max = 80)
  private String tagName;

  @Size(max = 30)
  private String tagColor;

  @Size(max = 300)
  private String description;

  @NotNull
  private Boolean isActive;
}

