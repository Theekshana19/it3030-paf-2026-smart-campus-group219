package lk.sliit.smartcampus.service.impl;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;
import lk.sliit.smartcampus.dto.request.LoginRequest;
import lk.sliit.smartcampus.dto.request.RegisterRequest;
import lk.sliit.smartcampus.dto.response.AuthSessionResponse;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.repository.UserRepository;
import lk.sliit.smartcampus.service.LocalCredentialsAuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LocalCredentialsAuthServiceImpl implements LocalCredentialsAuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public LocalCredentialsAuthServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public AuthSessionResponse register(RegisterRequest request) {
    String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      throw new IllegalArgumentException("An account with this email already exists");
    }

    LocalDateTime now = LocalDateTime.now();
    String generatedSub = "local_" + UUID.randomUUID().toString().replace("-", "");
    User user =
        User.builder()
            .googleSub(generatedSub)
            .email(email)
            .displayName(request.getName().trim())
            .passwordHash(passwordEncoder.encode(request.getPassword()))
            .role(UserRole.USER)
            .isActive(true)
            .createdAt(now)
            .updatedAt(now)
            .build();
    User saved = userRepository.save(user);
    return toSession(saved);
  }

  @Override
  @Transactional(readOnly = true)
  public AuthSessionResponse login(LoginRequest request) {
    String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
    User user =
        userRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

    String hash = user.getPasswordHash();
    if (hash == null || hash.isBlank() || !passwordEncoder.matches(request.getPassword(), hash)) {
      throw new IllegalArgumentException("Invalid email or password");
    }

    return toSession(user);
  }

  private AuthSessionResponse toSession(User user) {
    String token =
        user.getGoogleSub()
            + "|"
            + user.getEmail()
            + "|"
            + user.getDisplayName()
            + "|";
    return AuthSessionResponse.builder()
        .token(token)
        .name(user.getDisplayName())
        .email(user.getEmail())
        .role(user.getRole().name())
        .build();
  }
}
