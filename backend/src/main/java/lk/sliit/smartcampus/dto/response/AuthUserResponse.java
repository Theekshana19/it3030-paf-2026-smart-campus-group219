package lk.sliit.smartcampus.dto.response;

import java.time.LocalDateTime;
import java.util.List;
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
  private String role;
  private List<String> permissions;
  private Boolean isActive;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private String token;
}
