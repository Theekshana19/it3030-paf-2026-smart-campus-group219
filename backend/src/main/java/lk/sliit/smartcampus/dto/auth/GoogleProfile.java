package lk.sliit.smartcampus.dto.auth;

public record GoogleProfile(
    String sub, String email, String displayName, String profileImageUrl) {}
