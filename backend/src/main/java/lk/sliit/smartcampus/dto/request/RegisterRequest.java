package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

  @NotBlank(message = "displayName is required")
  @Size(max = 150)
  private String displayName;

  @NotBlank(message = "email is required")
  @Email(message = "email must be valid")
  @Size(max = 255)
  private String email;

  @NotBlank(message = "password is required")
  @Size(min = 6, max = 100, message = "password must be 6–100 characters")
  private String password;
}
