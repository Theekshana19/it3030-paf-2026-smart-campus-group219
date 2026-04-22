package lk.sliit.smartcampus.service;

import lk.sliit.smartcampus.dto.response.AuthUserResponse;

public interface AuthService {

  AuthUserResponse authenticateWithGoogle(String googleToken);

  AuthUserResponse getCurrentUser(String googleToken);
}

