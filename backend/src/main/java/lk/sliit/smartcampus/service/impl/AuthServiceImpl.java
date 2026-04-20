package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.Locale;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;

  public AuthServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public AuthUserResponse authenticateWithGoogle(String googleToken) {
    ParsedGoogleToken tokenData = parseGoogleToken(googleToken);
    User user =
        userRepository
            .findByGoogleSub(tokenData.sub())
            .map(existing -> updateExistingUser(existing, tokenData))
            .orElseGet(() -> createNewUser(tokenData));
    return toResponse(userRepository.save(user));
  }

  @Override
  @Transactional(readOnly = true)
  public AuthUserResponse getCurrentUser(String googleToken) {
    ParsedGoogleToken tokenData = parseGoogleToken(googleToken);
    User user =
        userRepository
            .findByGoogleSub(tokenData.sub())
            .orElseThrow(() -> new IllegalArgumentException("User not found for the provided token"));
    return toResponse(user);
  }

  private User createNewUser(ParsedGoogleToken tokenData) {
    LocalDateTime now = LocalDateTime.now();
    return User.builder()
        .googleSub(tokenData.sub())
        .email(tokenData.email())
        .displayName(tokenData.displayName())
        .profileImageUrl(tokenData.profileImageUrl())
        .role(UserRole.USER)
        .isActive(true)
        .createdAt(now)
        .updatedAt(now)
        .build();
  }

  private User updateExistingUser(User existing, ParsedGoogleToken tokenData) {
    existing.setEmail(tokenData.email());
    existing.setDisplayName(tokenData.displayName());
    existing.setProfileImageUrl(tokenData.profileImageUrl());
    existing.setUpdatedAt(LocalDateTime.now());
    if (existing.getRole() == null) {
      existing.setRole(UserRole.USER);
    }
    if (existing.getIsActive() == null) {
      existing.setIsActive(true);
    }
    return existing;
  }

  private AuthUserResponse toResponse(User user) {
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
        .build();
  }

  private ParsedGoogleToken parseGoogleToken(String googleToken) {
    String trimmed = googleToken == null ? "" : googleToken.trim();
    if (trimmed.isEmpty()) {
      throw new IllegalArgumentException("googleToken is required");
    }

    // Simple token format: "sub|email|displayName|profileImageUrl"
    String[] parts = trimmed.split("\\|", -1);
    String sub = parts[0].trim();
    if (sub.isEmpty()) {
      throw new IllegalArgumentException("googleToken must include a subject");
    }

    String email =
        parts.length > 1 && !parts[1].trim().isEmpty()
            ? parts[1].trim().toLowerCase(Locale.ROOT)
            : sub.toLowerCase(Locale.ROOT) + "@google.local";

    String displayName =
        parts.length > 2 && !parts[2].trim().isEmpty() ? parts[2].trim() : "Google User";

    String profileImageUrl = parts.length > 3 && !parts[3].trim().isEmpty() ? parts[3].trim() : null;

    return new ParsedGoogleToken(sub, email, displayName, profileImageUrl);
  }

  private record ParsedGoogleToken(
      String sub, String email, String displayName, String profileImageUrl) {}
}

