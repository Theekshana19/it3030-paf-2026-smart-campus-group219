package lk.sliit.smartcampus.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthSessionResponse {

  private String token;
  private String name;
  private String email;
  private String role;
}
