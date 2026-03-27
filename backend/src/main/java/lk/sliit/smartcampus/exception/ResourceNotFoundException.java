package lk.sliit.smartcampus.exception;

public class ResourceNotFoundException extends RuntimeException {

  public ResourceNotFoundException(Long resourceId) {
    super("Resource not found: " + resourceId);
  }
}
