package lk.sliit.smartcampus.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Locale;
import lk.sliit.smartcampus.dto.auth.GoogleProfile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class GoogleTokenVerifier {

  private final String clientId;
  private final boolean allowDevToken;
  private final GoogleIdTokenVerifier idTokenVerifier;

  public GoogleTokenVerifier(
      @Value("${app.google.client-id:}") String clientId,
      @Value("${app.auth.allow-dev-token:true}") boolean allowDevToken) {
    this.clientId = clientId;
    this.allowDevToken = allowDevToken;
    this.idTokenVerifier =
        clientId.isBlank()
            ? null
            : new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();
  }

  public GoogleProfile verify(String token) {
    String trimmed = token == null ? "" : token.trim();
    if (trimmed.isEmpty()) {
      throw new IllegalArgumentException("googleToken is required");
    }

    if (allowDevToken && trimmed.contains("|")) {
      return parsePipeToken(trimmed);
    }

    if (idTokenVerifier == null) {
      throw new IllegalArgumentException(
          "Set GOOGLE_CLIENT_ID (or app.google.client-id) to use Google ID tokens, or enable dev tokens.");
    }

    try {
      GoogleIdToken idToken = idTokenVerifier.verify(trimmed);
      if (idToken == null) {
        throw new IllegalArgumentException("Invalid Google ID token");
      }
      var payload = idToken.getPayload();
      String sub = payload.getSubject();
      String email =
          payload.getEmail() != null
              ? payload.getEmail().toLowerCase(Locale.ROOT)
              : sub + "@google.local";
      String name =
          (String) payload.get("name");
      if (name == null || name.isBlank()) {
        name = "Google User";
      }
      String picture = (String) payload.get("picture");
      return new GoogleProfile(sub, email, name, picture);
    } catch (IOException | GeneralSecurityException e) {
      throw new IllegalArgumentException("Could not verify Google ID token: " + e.getMessage());
    }
  }

  private GoogleProfile parsePipeToken(String trimmed) {
    String[] parts = trimmed.split("\\|", -1);
    String sub = parts[0].trim();
    if (sub.isEmpty()) {
      throw new IllegalArgumentException("googleToken must include a subject");
    }
    String email =
        parts.length > 1 && !parts[1].trim().isEmpty()
            ? parts[1].trim().toLowerCase(Locale.ROOT)
            : sub.toLowerCase(Locale.ROOT) + "@google.local";
    String displayName =
        parts.length > 2 && !parts[2].trim().isEmpty() ? parts[2].trim() : "Google User";
    String profileImageUrl = parts.length > 3 && !parts[3].trim().isEmpty() ? parts[3].trim() : null;
    return new GoogleProfile(sub, email, displayName, profileImageUrl);
  }
}
