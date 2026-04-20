package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lk.sliit.smartcampus.dto.request.GoogleAuthRequest;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Validated
@RequestMapping("/api/auth")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/google")
  public ResponseEntity<AuthUserResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
    AuthUserResponse response = authService.authenticateWithGoogle(request.getGoogleToken());
    return ResponseEntity.ok(response);
  }

  @GetMapping("/me")
  public AuthUserResponse me(
      @RequestParam @NotBlank(message = "googleToken is required") String googleToken) {
    return authService.getCurrentUser(googleToken);
  }
}

