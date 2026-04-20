package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  @Transactional(readOnly = true)
  public List<AuthUserResponse> getAllUsers() {
    return userRepository.findAll().stream().map(this::toResponse).toList();
  }

  @Override
  public AuthUserResponse updateUserRole(Long userId, UserRole role) {
    if (role == null) {
      throw new IllegalArgumentException("role is required");
    }

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

    user.setRole(role);
    user.setUpdatedAt(LocalDateTime.now());
    return toResponse(userRepository.save(user));
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

