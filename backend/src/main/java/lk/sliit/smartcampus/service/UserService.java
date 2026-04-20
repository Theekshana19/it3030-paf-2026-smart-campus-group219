package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.enums.UserRole;

public interface UserService {

  List<AuthUserResponse> getAllUsers();

  AuthUserResponse updateUserRole(Long userId, UserRole role);
}

