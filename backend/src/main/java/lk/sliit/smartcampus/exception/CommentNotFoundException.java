package lk.sliit.smartcampus.exception;

public class CommentNotFoundException extends RuntimeException {

  public CommentNotFoundException(Long commentId) {
    super("Comment with ID " + commentId + " was not found in system");
  }
}
