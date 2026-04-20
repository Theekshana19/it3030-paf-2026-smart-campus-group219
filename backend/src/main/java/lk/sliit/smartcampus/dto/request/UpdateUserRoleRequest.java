package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotNull;
import lk.sliit.smartcampus.enums.UserRole;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRoleRequest {

  @NotNull(message = "role is required")
  private UserRole role;
}

