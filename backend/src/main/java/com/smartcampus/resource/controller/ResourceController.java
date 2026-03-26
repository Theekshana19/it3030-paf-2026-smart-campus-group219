package com.smartcampus.resource.controller;

import com.smartcampus.resource.service.ResourceDbService;
import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

  private final ResourceDbService resourceDbService;

  public ResourceController(ResourceDbService resourceDbService) {
    this.resourceDbService = resourceDbService;
  }

  @GetMapping("/test-db")
  public ResponseEntity<?> testDb() {
    try {
      return ResponseEntity.ok(resourceDbService.testDbConnection());
    } catch (DataAccessException ex) {
      String message = ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Map.of("connected", false, "error", message));
    }
  }
}

