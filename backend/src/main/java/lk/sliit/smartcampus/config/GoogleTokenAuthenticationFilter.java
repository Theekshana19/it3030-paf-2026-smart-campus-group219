package lk.sliit.smartcampus.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import lk.sliit.smartcampus.dto.auth.GoogleProfile;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.security.AuthTokenExtractor;
import lk.sliit.smartcampus.security.GoogleTokenVerifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class GoogleTokenAuthenticationFilter extends OncePerRequestFilter {

  private final AuthTokenExtractor authTokenExtractor;
  private final GoogleTokenVerifier googleTokenVerifier;
  private final UserRepository userRepository;

  public GoogleTokenAuthenticationFilter(
      AuthTokenExtractor authTokenExtractor,
      GoogleTokenVerifier googleTokenVerifier,
      UserRepository userRepository) {
    this.authTokenExtractor = authTokenExtractor;
    this.googleTokenVerifier = googleTokenVerifier;
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    if (SecurityContextHolder.getContext().getAuthentication() == null) {
      String token = authTokenExtractor.extract(request);
      if (!token.isBlank()) {
        try {
          GoogleProfile profile = googleTokenVerifier.verify(token);
          userRepository
              .findByGoogleSub(profile.sub())
              .ifPresent(this::authenticateUser);
        } catch (IllegalArgumentException ignored) {
          // Invalid token: leave unauthenticated so secured endpoints return 401.
        }
      }
    }

    filterChain.doFilter(request, response);
  }

  private void authenticateUser(User user) {
    UsernamePasswordAuthenticationToken authToken =
        new UsernamePasswordAuthenticationToken(
            user.getGoogleSub(),
            null,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
    SecurityContextHolder.getContext().setAuthentication(authToken);
  }
}
