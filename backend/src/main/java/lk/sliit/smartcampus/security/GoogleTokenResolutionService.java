package lk.sliit.smartcampus.security;

import lk.sliit.smartcampus.dto.auth.GoogleProfile;
import lk.sliit.smartcampus.entity.User;
import lk.sliit.smartcampus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GoogleTokenResolutionService {

  private final GoogleTokenVerifier googleTokenVerifier;
  private final UserRepository userRepository;

  public GoogleTokenResolutionService(
      GoogleTokenVerifier googleTokenVerifier, UserRepository userRepository) {
    this.googleTokenVerifier = googleTokenVerifier;
    this.userRepository = userRepository;
  }

  public GoogleProfile resolveProfile(String token) {
    return googleTokenVerifier.verify(token);
  }

  @Transactional(readOnly = true)
  public User resolveUser(String token) {
    GoogleProfile profile = resolveProfile(token);
    return userRepository
        .findByGoogleSub(profile.sub())
        .orElseThrow(() -> new IllegalArgumentException("User not found for the provided token"));
  }
}
