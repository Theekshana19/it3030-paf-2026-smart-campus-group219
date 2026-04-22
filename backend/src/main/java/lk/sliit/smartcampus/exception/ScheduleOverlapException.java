package lk.sliit.smartcampus.exception;

public class ScheduleOverlapException extends RuntimeException {
  public ScheduleOverlapException(Long resourceId) {
    super("Schedule overlaps an existing active schedule for resource " + resourceId);
  }
}
