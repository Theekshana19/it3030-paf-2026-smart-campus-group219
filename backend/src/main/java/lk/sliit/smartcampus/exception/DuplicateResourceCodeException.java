package lk.sliit.smartcampus.exception;

public class DuplicateResourceCodeException extends RuntimeException {

  public DuplicateResourceCodeException(String resourceCode) {
    super("Resource code already exists: " + resourceCode);
  }
}
