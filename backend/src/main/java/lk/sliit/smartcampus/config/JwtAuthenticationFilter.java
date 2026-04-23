package lk.sliit.smartcampus.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.repository.UserRepository;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtUtil jwtUtil;
  private final UserRepository userRepository;

  public JwtAuthenticationFilter(JwtUtil jwtUtil, UserRepository userRepository) {
    this.jwtUtil = jwtUtil;
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    String token = extractToken(request);

    if (token != null && jwtUtil.validateToken(token)) {
      Long userId = jwtUtil.extractUserId(token);
      userRepository.findById(userId).ifPresent(user -> setAuthentication(user, token));
    }

    chain.doFilter(request, response);
  }

  private void setAuthentication(User user, String token) {
    String role = jwtUtil.extractRole(token).name();
    var authority = new SimpleGrantedAuthority("ROLE_" + role);
    var auth = new UsernamePasswordAuthenticationToken(user, null, List.of(authority));
    SecurityContextHolder.getContext().setAuthentication(auth);
  }

  private String extractToken(HttpServletRequest request) {
    String header = request.getHeader("Authorization");
    if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
      return header.substring(7);
    }
    return null;
  }
}
