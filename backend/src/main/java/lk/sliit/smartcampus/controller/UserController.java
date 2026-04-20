package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.util.List;
import lk.sliit.smartcampus.dto.request.UpdateUserRoleRequest;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping
  public ResponseEntity<List<AuthUserResponse>> getAllUsers() {
    return ResponseEntity.ok(userService.getAllUsers());
  }

  @PatchMapping("/{id}/role")
  public ResponseEntity<AuthUserResponse> updateUserRole(
      @PathVariable("id") Long userId, @Valid @RequestBody UpdateUserRoleRequest request) {
    AuthUserResponse updatedUser = userService.updateUserRole(userId, request.getRole());
    return ResponseEntity.ok(updatedUser);
  }
}

