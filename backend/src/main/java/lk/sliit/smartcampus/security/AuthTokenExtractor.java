package lk.sliit.smartcampus.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class AuthTokenExtractor {

  public String extract(HttpServletRequest request) {
    String auth = request.getHeader("Authorization");
    if (auth != null && auth.regionMatches(true, 0, "Bearer ", 0, 7)) {
      return auth.substring(7).trim();
    }
    String query = request.getParameter("googleToken");
    return query != null ? query.trim() : "";
  }
}
