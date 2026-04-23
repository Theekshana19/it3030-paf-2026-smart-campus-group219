package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Map;
import lk.sliit.smartcampus.config.JwtUtil;
import lk.sliit.smartcampus.dto.request.LoginRequest;
import lk.sliit.smartcampus.dto.request.RegisterRequest;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.exception.UnauthorizedException;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.service.AuthService;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  private static final String GOOGLE_TOKENINFO_URL =
      "https://oauth2.googleapis.com/tokeninfo?id_token={token}";

  private final UserRepository userRepository;
  private final JwtUtil jwtUtil;
  private final PasswordEncoder passwordEncoder;
  private final RestTemplate restTemplate;

  public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil,
      PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = passwordEncoder;
    this.restTemplate = new RestTemplate();
  }

  @Override
  public AuthUserResponse authenticateWithGoogle(String googleToken) {
    GoogleTokenInfo tokenInfo = verifyGoogleToken(googleToken);
    User user =
        userRepository
            .findByGoogleSub(tokenInfo.sub())
            .map(existing -> updateExistingUser(existing, tokenInfo))
            .orElseGet(() -> createNewUser(tokenInfo));
    User saved = userRepository.save(user);
    String jwt = jwtUtil.generateToken(saved);
    return toResponse(saved, jwt);
  }

  @Override
  @Transactional(readOnly = true)
  public AuthUserResponse getCurrentUser(String googleToken) {
    GoogleTokenInfo tokenInfo = verifyGoogleToken(googleToken);
    User user =
        userRepository
            .findByGoogleSub(tokenInfo.sub())
            .orElseThrow(() -> new UnauthorizedException("User not found"));
    String jwt = jwtUtil.generateToken(user);
    return toResponse(user, jwt);
  }

  private GoogleTokenInfo verifyGoogleToken(String googleToken) {
    if (googleToken == null || googleToken.isBlank()) {
      throw new UnauthorizedException("Google ID token is required");
    }
    try {
      ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
          GOOGLE_TOKENINFO_URL,
          HttpMethod.GET,
          null,
          new ParameterizedTypeReference<Map<String, Object>>() {},
          googleToken);

      Map<String, Object> claims = response.getBody();
      if (!response.getStatusCode().is2xxSuccessful() || claims == null) {
        throw new UnauthorizedException("Invalid Google ID token");
      }

      String sub = (String) claims.get("sub");
      if (sub == null || sub.isBlank()) {
        throw new UnauthorizedException("Invalid Google ID token: missing subject");
      }

      String email = (String) claims.getOrDefault("email", sub.toLowerCase(Locale.ROOT) + "@google.local");
      String name = (String) claims.getOrDefault("name", "Google User");
      String picture = (String) claims.get("picture");

      return new GoogleTokenInfo(sub, email.toLowerCase(Locale.ROOT), name, picture);
    } catch (RestClientException e) {
      throw new UnauthorizedException("Failed to verify Google token: " + e.getMessage());
    }
  }

  private User createNewUser(GoogleTokenInfo info) {
    LocalDateTime now = LocalDateTime.now();
    return User.builder()
        .googleSub(info.sub())
        .email(info.email())
        .displayName(info.displayName())
        .profileImageUrl(info.profileImageUrl())
        .role(UserRole.USER)
        .isActive(true)
        .createdAt(now)
        .updatedAt(now)
        .build();
  }

  private User updateExistingUser(User existing, GoogleTokenInfo info) {
    existing.setEmail(info.email());
    existing.setDisplayName(info.displayName());
    existing.setProfileImageUrl(info.profileImageUrl());
    existing.setUpdatedAt(LocalDateTime.now());
    if (existing.getRole() == null) {
      existing.setRole(UserRole.USER);
    }
    if (existing.getIsActive() == null) {
      existing.setIsActive(true);
    }
    return existing;
  }

  @Override
  public AuthUserResponse register(RegisterRequest request) {
    String email = request.getEmail().toLowerCase(Locale.ROOT);
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new IllegalArgumentException("Email is already registered: " + email);
    }
    LocalDateTime now = LocalDateTime.now();
    User user = User.builder()
        .email(email)
        .displayName(request.getDisplayName())
        .passwordHash(passwordEncoder.encode(request.getPassword()))
        .role(UserRole.USER)
        .isActive(true)
        .createdAt(now)
        .updatedAt(now)
        .build();
    User saved = userRepository.save(user);
    return toResponse(saved, jwtUtil.generateToken(saved));
  }

  @Override
  public AuthUserResponse login(LoginRequest request) {
    String email = request.getEmail().toLowerCase(Locale.ROOT);
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
    if (user.getPasswordHash() == null) {
      throw new UnauthorizedException("This account uses Google Sign-In. Please log in with Google.");
    }
    if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
      throw new UnauthorizedException("Invalid email or password");
    }
    if (Boolean.FALSE.equals(user.getIsActive())) {
      throw new UnauthorizedException("Account is deactivated");
    }
    return toResponse(user, jwtUtil.generateToken(user));
  }

  @Override
  public AuthUserResponse buildResponse(User user, String token) {
    return toResponse(user, token);
  }

  private AuthUserResponse toResponse(User user, String token) {
    return AuthUserResponse.builder()
        .userId(user.getUserId())
        .googleSub(user.getGoogleSub())
        .email(user.getEmail())
        .displayName(user.getDisplayName())
        .profileImageUrl(user.getProfileImageUrl())
        .role(user.getRole())
        .isActive(user.getIsActive())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .token(token)
        .build();
  }

  private record GoogleTokenInfo(
      String sub, String email, String displayName, String profileImageUrl) {}
}
