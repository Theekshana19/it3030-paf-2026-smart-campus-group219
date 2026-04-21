package lk.sliit.smartcampus.service;

import lk.sliit.smartcampus.dto.request.LoginRequest;
import lk.sliit.smartcampus.dto.request.RegisterRequest;
import lk.sliit.smartcampus.dto.response.AuthSessionResponse;

public interface LocalCredentialsAuthService {

  AuthSessionResponse register(RegisterRequest request);

  AuthSessionResponse login(LoginRequest request);
}
