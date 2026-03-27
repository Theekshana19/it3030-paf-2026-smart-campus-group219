package lk.sliit.smartcampus.exception;

public class TagNotFoundException extends RuntimeException {

  public TagNotFoundException(Long tagId) {
    super("Resource tag not found: " + tagId);
  }
}
