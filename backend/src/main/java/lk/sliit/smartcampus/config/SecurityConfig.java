package lk.sliit.smartcampus.config;

import lk.sliit.smartcampus.enums.UserRole;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/api/auth/google")
                    .permitAll()
                    .requestMatchers("/api/auth/me", "/api/notifications/**")
                    .authenticated()
                    .requestMatchers("/api/users/**")
                    .hasRole(UserRole.ADMIN.name())
                    .anyRequest()
                    .permitAll());

    return http.build();
  }
}
