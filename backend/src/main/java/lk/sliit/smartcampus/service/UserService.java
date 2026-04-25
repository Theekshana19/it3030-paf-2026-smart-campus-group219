package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;

public interface UserService {

  List<AuthUserResponse> getAllUsers();

  AuthUserResponse updateUserRole(Long userId, Long roleId);
}
