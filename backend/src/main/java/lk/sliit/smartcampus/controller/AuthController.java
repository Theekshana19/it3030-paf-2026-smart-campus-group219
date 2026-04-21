package lk.sliit.smartcampus.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lk.sliit.smartcampus.dto.request.LoginRequest;
import lk.sliit.smartcampus.dto.request.GoogleAuthRequest;
import lk.sliit.smartcampus.dto.request.RegisterRequest;
import lk.sliit.smartcampus.dto.response.AuthSessionResponse;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.security.AuthTokenExtractor;
import lk.sliit.smartcampus.service.AuthService;
import lk.sliit.smartcampus.service.LocalCredentialsAuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * OAuth 2.0–backed authentication: {@code POST /google} accepts a Google ID token (from the Google Identity
 * Services client) or a dev pipe-token when enabled. {@code GET /me} returns the persisted user for the
 * bearer/query token.
 */
@RestController
@Validated
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final AuthTokenExtractor authTokenExtractor;
  private final LocalCredentialsAuthService localCredentialsAuthService;

  public AuthController(
      AuthService authService,
      AuthTokenExtractor authTokenExtractor,
      LocalCredentialsAuthService localCredentialsAuthService) {
    this.authService = authService;
    this.authTokenExtractor = authTokenExtractor;
    this.localCredentialsAuthService = localCredentialsAuthService;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthSessionResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(localCredentialsAuthService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthSessionResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(localCredentialsAuthService.login(request));
  }

  @PostMapping("/google")
  public ResponseEntity<AuthUserResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
    AuthUserResponse response = authService.authenticateWithGoogle(request.getGoogleToken());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/me")
  public AuthUserResponse me(
      HttpServletRequest request, @RequestParam(required = false) String googleToken) {
    String token = authTokenExtractor.extract(request);
    if (!token.isBlank()) {
      return authService.getCurrentUser(token);
    }
    if (googleToken != null && !googleToken.isBlank()) {
      return authService.getCurrentUser(googleToken);
    }
    throw new IllegalArgumentException("googleToken is required (Authorization Bearer or query parameter)");
  }
}
