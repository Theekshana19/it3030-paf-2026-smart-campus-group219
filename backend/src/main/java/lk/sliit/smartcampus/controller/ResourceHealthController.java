package lk.sliit.smartcampus.controller;

import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceHealthController {

  private final JdbcTemplate jdbcTemplate;

  public ResourceHealthController(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  @GetMapping("/test-db")
  public Map<String, Object> testDbConnection() {
    jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    return Map.of(
        "connected", true,
        "module", "Member 1 Resources"
    );
  }
}

