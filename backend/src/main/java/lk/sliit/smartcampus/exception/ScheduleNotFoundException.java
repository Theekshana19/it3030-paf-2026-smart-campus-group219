package lk.sliit.smartcampus.exception;

public class ScheduleNotFoundException extends RuntimeException {

  public ScheduleNotFoundException(Long scheduleId) {
    super("Status schedule not found: " + scheduleId);
  }
}
