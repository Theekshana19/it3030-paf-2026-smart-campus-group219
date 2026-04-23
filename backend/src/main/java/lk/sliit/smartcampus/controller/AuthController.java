package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import lk.sliit.smartcampus.config.JwtUtil;
import lk.sliit.smartcampus.dto.request.GoogleAuthRequest;
import lk.sliit.smartcampus.dto.request.LoginRequest;
import lk.sliit.smartcampus.dto.request.RegisterRequest;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.exception.UnauthorizedException;
import lk.sliit.smartcampus.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;
  private final JwtUtil jwtUtil;

  public AuthController(AuthService authService, JwtUtil jwtUtil) {
    this.authService = authService;
    this.jwtUtil = jwtUtil;
  }

  @PostMapping("/google")
  public ResponseEntity<AuthUserResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
    return ResponseEntity.ok(authService.authenticateWithGoogle(request.getGoogleToken()));
  }

  @PostMapping("/register")
  public ResponseEntity<AuthUserResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthUserResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @GetMapping("/me")
  public AuthUserResponse me() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !(auth.getPrincipal() instanceof User user)) {
      throw new UnauthorizedException("Not authenticated");
    }
    String token = jwtUtil.generateToken(user);
    return authService.buildResponse(user, token);
  }
}
