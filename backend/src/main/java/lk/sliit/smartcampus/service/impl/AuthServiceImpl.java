package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import lk.sliit.smartcampus.dto.auth.GoogleProfile;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.security.GoogleTokenVerifier;
import lk.sliit.smartcampus.service.AuthService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

  private final UserRepository userRepository;
  private final GoogleTokenVerifier googleTokenVerifier;

  public AuthServiceImpl(UserRepository userRepository, GoogleTokenVerifier googleTokenVerifier) {
    this.userRepository = userRepository;
    this.googleTokenVerifier = googleTokenVerifier;
  }

  @Override
  public AuthUserResponse authenticateWithGoogle(String googleToken) {
    GoogleProfile profile = googleTokenVerifier.verify(googleToken);
    User user =
        userRepository
            .findByGoogleSub(profile.sub())
            .map(existing -> updateExistingUser(existing, profile))
            .orElseGet(() -> createNewUser(profile));
    return toResponse(userRepository.save(user));
  }

  @Override
  @Transactional(readOnly = true)
  public AuthUserResponse getCurrentUser(String googleToken) {
    GoogleProfile profile = googleTokenVerifier.verify(googleToken);
    User user =
        userRepository
            .findByGoogleSub(profile.sub())
            .orElseThrow(() -> new IllegalArgumentException("User not found for the provided token"));
    return toResponse(user);
  }

  private User createNewUser(GoogleProfile profile) {
    LocalDateTime now = LocalDateTime.now();
    return User.builder()
        .googleSub(profile.sub())
        .email(profile.email())
        .displayName(profile.displayName())
        .profileImageUrl(profile.profileImageUrl())
        .role(UserRole.USER)
        .isActive(true)
        .createdAt(now)
        .updatedAt(now)
        .build();
  }

  private User updateExistingUser(User existing, GoogleProfile profile) {
    existing.setEmail(profile.email());
    existing.setDisplayName(profile.displayName());
    existing.setProfileImageUrl(profile.profileImageUrl());
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
}
