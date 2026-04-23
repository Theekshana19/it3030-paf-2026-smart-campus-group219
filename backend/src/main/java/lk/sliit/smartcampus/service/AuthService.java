package lk.sliit.smartcampus.service;

import lk.sliit.smartcampus.dto.request.LoginRequest;
import lk.sliit.smartcampus.dto.request.RegisterRequest;
import lk.sliit.smartcampus.dto.response.AuthUserResponse;
import lk.sliit.smartcampus.entity.User;

public interface AuthService {

  AuthUserResponse authenticateWithGoogle(String googleToken);

  AuthUserResponse getCurrentUser(String googleToken);

  AuthUserResponse register(RegisterRequest request);

  AuthUserResponse login(LoginRequest request);

  AuthUserResponse buildResponse(User user, String token);
}

