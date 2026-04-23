package lk.sliit.smartcampus.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import javax.crypto.SecretKey;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

  private final SecretKey signingKey;
  private final long expirationMs;

  public JwtUtil(JwtProperties props) {
    this.signingKey = Keys.hmacShaKeyFor(props.getSecret().getBytes(StandardCharsets.UTF_8));
    this.expirationMs = props.getExpirationMs();
  }

  public String generateToken(User user) {
    long now = System.currentTimeMillis();
    return Jwts.builder()
        .subject(String.valueOf(user.getUserId()))
        .claim("email", user.getEmail())
        .claim("role", user.getRole().name())
        .issuedAt(new Date(now))
        .expiration(new Date(now + expirationMs))
        .signWith(signingKey)
        .compact();
  }

  public boolean validateToken(String token) {
    try {
      parseClaims(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }

  public Long extractUserId(String token) {
    return Long.valueOf(parseClaims(token).getSubject());
  }

  public UserRole extractRole(String token) {
    String role = parseClaims(token).get("role", String.class);
    return UserRole.valueOf(role);
  }

  private Claims parseClaims(String token) {
    return Jwts.parser()
        .verifyWith(signingKey)
        .build()
        .parseSignedClaims(token)
        .getPayload();
  }
}
