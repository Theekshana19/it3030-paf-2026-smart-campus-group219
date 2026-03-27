package lk.sliit.smartcampus.exception;

public class DuplicateTagMappingException extends RuntimeException {

  public DuplicateTagMappingException(Long resourceId, Long tagId) {
    super("Tag already mapped to resource %d: tag %d".formatted(resourceId, tagId));
  }
}
