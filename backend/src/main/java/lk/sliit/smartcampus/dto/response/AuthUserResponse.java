package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import lk.sliit.smartcampus.enums.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthUserResponse {

  private Long userId;
  private String googleSub;
  private String email;
  private String displayName;
  private String profileImageUrl;
  private UserRole role;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String token;
}

