package com.smartcampus.resource.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ResourceDbService {

  private final JdbcTemplate jdbcTemplate;

  public ResourceDbService(JdbcTemplate jdbcTemplate) {
    this.jdbcTemplate = jdbcTemplate;
  }

  public ResourceDbCheckResponse testDbConnection() {
    // Simple and safe connectivity check
    jdbcTemplate.queryForObject("SELECT 1", Integer.class);

    // Return actual DB name to prove we reached the expected database
    String dbName = jdbcTemplate.queryForObject("SELECT DB_NAME()", String.class);
    return new ResourceDbCheckResponse(true, dbName);
  }

  public record ResourceDbCheckResponse(boolean connected, String databaseName) {}
}

