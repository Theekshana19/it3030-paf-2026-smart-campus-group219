package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.util.Map;
import lk.sliit.smartcampus.dto.request.ResourceCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceListResponse;
import lk.sliit.smartcampus.dto.response.ResourceResponse;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.service.ResourceService;
import lk.sliit.smartcampus.service.ResourceTagMappingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

  private final ResourceService resourceService;
  private final ResourceTagMappingService resourceTagMappingService;
  private final JdbcTemplate jdbcTemplate;

  public ResourceController(
      ResourceService resourceService,
      ResourceTagMappingService resourceTagMappingService,
      JdbcTemplate jdbcTemplate) {
    this.resourceService = resourceService;
    this.resourceTagMappingService = resourceTagMappingService;
    this.jdbcTemplate = jdbcTemplate;
  }

  @GetMapping("/test-db")
  public Map<String, Object> testDbConnection() {
    jdbcTemplate.queryForObject("SELECT 1", Integer.class);
    return Map.of("connected", true, "module", "Member 1 Resources");
  }

  @PostMapping
  public ResponseEntity<ResourceResponse> create(@Valid @RequestBody ResourceCreateRequest request) {
    ResourceResponse body = resourceService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  @GetMapping
  public ResourceListResponse list(
      @RequestParam(required = false) ResourceType type,
      @RequestParam(required = false) Integer minCapacity,
      @RequestParam(required = false) String building,
      @RequestParam(required = false) ResourceStatus status,
      @RequestParam(required = false) String tag,
      @RequestParam(required = false) String search,
      @RequestParam(defaultValue = "0") Integer page,
      @RequestParam(defaultValue = "10") Integer size,
      @RequestParam(defaultValue = "resourceId") String sortBy,
      @RequestParam(defaultValue = "asc") String sortDir) {
    if (page < 0) {
      throw new IllegalArgumentException("page must be greater than or equal to 0");
    }
    if (size < 1 || size > 100) {
      throw new IllegalArgumentException("size must be between 1 and 100");
    }
    String sanitizedSortBy = StringUtils.hasText(sortBy) ? sortBy : "resourceId";
    String sanitizedSortDir = "desc".equalsIgnoreCase(sortDir) ? "desc" : "asc";
    return resourceService.findAll(
        type,
        minCapacity,
        building,
        status,
        tag,
        search,
        page,
        size,
        sanitizedSortBy,
        sanitizedSortDir);
  }

  @GetMapping("/{id}")
  public ResourceResponse getById(@PathVariable Long id) {
    return resourceService.getById(id);
  }

  @PutMapping("/{id}")
  public ResourceResponse update(
      @PathVariable Long id, @Valid @RequestBody ResourceUpdateRequest request) {
    return resourceService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    resourceService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{resourceId}/tags/{tagId}")
  public ResponseEntity<Void> addTag(
      @PathVariable Long resourceId, @PathVariable Long tagId) {
    resourceTagMappingService.addTagToResource(resourceId, tagId);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @DeleteMapping("/{resourceId}/tags/{tagId}")
  public ResponseEntity<Void> removeTag(
      @PathVariable Long resourceId, @PathVariable Long tagId) {
    resourceTagMappingService.removeTagFromResource(resourceId, tagId);
    return ResponseEntity.noContent().build();
  }
}
