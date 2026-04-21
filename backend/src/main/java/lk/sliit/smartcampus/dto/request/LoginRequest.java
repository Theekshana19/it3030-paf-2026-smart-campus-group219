package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

  @NotBlank(message = "email is required")
  @Email(message = "email must be valid")
  @Size(max = 255, message = "email must be at most 255 characters")
  private String email;

  @NotBlank(message = "password is required")
  @Size(min = 6, message = "password must be at least 6 characters")
  @Size(max = 100, message = "password must be at most 100 characters")
  private String password;
}
