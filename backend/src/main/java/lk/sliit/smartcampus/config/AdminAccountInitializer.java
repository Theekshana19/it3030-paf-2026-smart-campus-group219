package main.java.lk.sliit.smartcampus.config;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.enums.UserRole;
import lk.sliit.smartcampus.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates a one-time super-admin account on application startup if it does not already exist.
 *
 * Defaults to email `admin@gmail.com` and password `A1234` but these can be overridden
 * using `app.admin.email` and `app.admin.password` environment properties.
 */
@Component
public class AdminAccountInitializer implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(AdminAccountInitializer.class);

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Value("${app.admin.email:admin@gmail.com}")
  private String adminEmail;

  @Value("${app.admin.password:A123456}")
  private String adminPassword;

  public AdminAccountInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  @Override
  public void run(ApplicationArguments args) throws Exception {
    String email = adminEmail == null ? "admin@gmail.com" : adminEmail.trim().toLowerCase(Locale.ROOT);
    if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
      log.info("Admin account already exists for email={}", email);
      return;
    }

    LocalDateTime now = LocalDateTime.now();
    String generatedSub = "local_admin_" + UUID.randomUUID().toString().replace("-", "");

    User admin =
        User.builder()
            .googleSub(generatedSub)
            .email(email)
            .displayName("Super Admin")
            .passwordHash(passwordEncoder.encode(adminPassword))
            .role(UserRole.ADMIN)
            .isActive(true)
            .createdAt(now)
            .updatedAt(now)
            .build();

    userRepository.save(admin);
    log.info("Created one-time super-admin account: {} (password from env or default)", email);
  }
}
