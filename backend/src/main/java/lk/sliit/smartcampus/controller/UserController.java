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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.validation.annotation.Validated;

@RestController
@Validated
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
  public ResponseEntity<AuthUserResponse> patchUserRole(
      @PathVariable("id") Long userId, @Valid @RequestBody UpdateUserRoleRequest request) {
    return updateRoleResponse(userId, request);
  }

  /** PUT is an alternative to PATCH for role updates (REST semantics: replace role). */
  @PutMapping("/{id}/role")
  public ResponseEntity<AuthUserResponse> putUserRole(
      @PathVariable("id") Long userId, @Valid @RequestBody UpdateUserRoleRequest request) {
    return updateRoleResponse(userId, request);
  }

  private ResponseEntity<AuthUserResponse> updateRoleResponse(
      Long userId, UpdateUserRoleRequest request) {
    AuthUserResponse updatedUser = userService.updateUserRole(userId, request.getRole());
    return ResponseEntity.ok(updatedUser);
  }
}

