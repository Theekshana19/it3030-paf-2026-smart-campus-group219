package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceTagBulkAssignRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceTagUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceTagBulkAssignResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagOverviewResponse;
import lk.sliit.smartcampus.dto.response.ResourceTagResponse;
import lk.sliit.smartcampus.service.ResourceTagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resource-tags")
public class ResourceTagController {

  private final ResourceTagService resourceTagService;

  public ResourceTagController(ResourceTagService resourceTagService) {
    this.resourceTagService = resourceTagService;
  }

  @GetMapping
  public List<ResourceTagResponse> list() {
    return resourceTagService.findAll();
  }

  @GetMapping("/overview")
  public ResourceTagOverviewResponse overview() {
    return resourceTagService.getOverview();
  }

  @PostMapping("/bulk-assign")
  public ResponseEntity<ResourceTagBulkAssignResponse> bulkAssign(
      @Valid @RequestBody ResourceTagBulkAssignRequest request) {
    return ResponseEntity.ok(resourceTagService.bulkAssign(request));
  }

  @GetMapping("/{id}")
  public ResourceTagResponse getById(@PathVariable Long id) {
    return resourceTagService.getById(id);
  }

  @PostMapping
  public ResponseEntity<ResourceTagResponse> create(
      @Valid @RequestBody ResourceTagCreateRequest request) {
    ResourceTagResponse body = resourceTagService.create(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  @PutMapping("/{id}")
  public ResourceTagResponse update(
      @PathVariable Long id, @Valid @RequestBody ResourceTagUpdateRequest request) {
    return resourceTagService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    resourceTagService.delete(id);
    return ResponseEntity.noContent().build();
  }
}
