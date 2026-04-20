package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleAuthRequest {

  @NotBlank(message = "googleToken is required")
  private String googleToken;
}

