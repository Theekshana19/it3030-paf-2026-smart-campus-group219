package lk.sliit.smartcampus.controller;

import jakarta.validation.Valid;
import java.util.List;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleCreateRequest;
import lk.sliit.smartcampus.dto.request.ResourceStatusScheduleUpdateRequest;
import lk.sliit.smartcampus.dto.response.ResourceStatusScheduleResponse;
import lk.sliit.smartcampus.service.ResourceStatusScheduleService;
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
@RequestMapping("/api/resources/{resourceId}/status-schedules")
public class ResourceStatusScheduleController {

  private final ResourceStatusScheduleService resourceStatusScheduleService;

  public ResourceStatusScheduleController(
      ResourceStatusScheduleService resourceStatusScheduleService) {
    this.resourceStatusScheduleService = resourceStatusScheduleService;
  }

  @PostMapping
  public ResponseEntity<ResourceStatusScheduleResponse> create(
      @PathVariable Long resourceId,
      @Valid @RequestBody ResourceStatusScheduleCreateRequest request) {
    ResourceStatusScheduleResponse body =
        resourceStatusScheduleService.create(resourceId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(body);
  }

  @GetMapping
  public List<ResourceStatusScheduleResponse> list(@PathVariable Long resourceId) {
    return resourceStatusScheduleService.findByResource(resourceId);
  }

  @PutMapping("/{scheduleId}")
  public ResourceStatusScheduleResponse update(
      @PathVariable Long resourceId,
      @PathVariable Long scheduleId,
      @Valid @RequestBody ResourceStatusScheduleUpdateRequest request) {
    return resourceStatusScheduleService.update(resourceId, scheduleId, request);
  }

  @DeleteMapping("/{scheduleId}")
  public ResponseEntity<Void> delete(
      @PathVariable Long resourceId, @PathVariable Long scheduleId) {
    resourceStatusScheduleService.delete(resourceId, scheduleId);
    return ResponseEntity.noContent().build();
  }
}
