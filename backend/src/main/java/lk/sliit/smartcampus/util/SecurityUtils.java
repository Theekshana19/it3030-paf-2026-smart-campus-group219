package lk.sliit.smartcampus.util;

import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

  public User getCurrentUser() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof User user)) {
      throw new UnauthorizedException("Not authenticated");
    }
    return user;
  }

  public Long getCurrentUserId() {
    return getCurrentUser().getUserId();
  }
}
