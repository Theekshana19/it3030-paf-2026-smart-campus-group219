package lk.sliit.smartcampus.exception;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ApiErrorResponse> handleNotFound(
      ResourceNotFoundException exception, HttpServletRequest request) {
    return build(HttpStatus.NOT_FOUND, exception.getMessage(), request);
  }

  @ExceptionHandler({TagNotFoundException.class, ScheduleNotFoundException.class,
      BookingNotFoundException.class, TicketNotFoundException.class,
      CommentNotFoundException.class})
  public ResponseEntity<ApiErrorResponse> handleNotFound(
      RuntimeException exception, HttpServletRequest request) {
    return build(HttpStatus.NOT_FOUND, exception.getMessage(), request);
  }

  @ExceptionHandler({DuplicateResourceCodeException.class, DuplicateTagMappingException.class,
      BookingConflictException.class})
  public ResponseEntity<ApiErrorResponse> handleConflict(
      RuntimeException exception, HttpServletRequest request) {
    return build(HttpStatus.CONFLICT, exception.getMessage(), request);
  }

  @ExceptionHandler({InvalidBookingStateException.class, InvalidTicketStateException.class,
      AttachmentLimitException.class})
  public ResponseEntity<ApiErrorResponse> handleInvalidState(
      RuntimeException exception, HttpServletRequest request) {
    return build(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
  }

  @ExceptionHandler(CommentOwnershipException.class)
  public ResponseEntity<ApiErrorResponse> handleForbidden(
      CommentOwnershipException exception, HttpServletRequest request) {
    return build(HttpStatus.FORBIDDEN, exception.getMessage(), request);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiErrorResponse> handleBadRequest(
      IllegalArgumentException exception, HttpServletRequest request) {
    return build(HttpStatus.BAD_REQUEST, exception.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ApiErrorResponse> handleValidation(
      MethodArgumentNotValidException exception, HttpServletRequest request) {
    String message =
        exception.getBindingResult().getFieldErrors().stream()
            .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
            .collect(Collectors.joining("; "));
    return build(HttpStatus.BAD_REQUEST, message, request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ApiErrorResponse> handleGenericException(
      Exception exception, HttpServletRequest request) {
    return build(
        HttpStatus.INTERNAL_SERVER_ERROR,
        exception.getMessage() != null ? exception.getMessage() : "Unexpected error",
        request);
  }

  private ResponseEntity<ApiErrorResponse> build(
      HttpStatus status, String message, HttpServletRequest request) {
    ApiErrorResponse error =
        new ApiErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI());
    return ResponseEntity.status(status).body(error);
  }
}
