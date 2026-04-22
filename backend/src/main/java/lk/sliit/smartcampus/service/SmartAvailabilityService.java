package lk.sliit.smartcampus.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import lk.sliit.smartcampus.entity.Resource;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.enums.ResourceStatus;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import lk.sliit.smartcampus.enums.SmartAvailabilityStatus;
import org.springframework.stereotype.Service;

@Service
public class SmartAvailabilityService {

  private static final int BUSY_SOON_WINDOW_MINUTES = 120;

  /**
   * Half-open window {@code [start, end)}: active from start (inclusive) until end (exclusive),
   * aligned with schedule overlap rules elsewhere in the app.
   */
  private static boolean isNowWithinSchedule(
      ResourceStatusSchedule s, LocalDate today, LocalDateTime now) {
    if (!Boolean.TRUE.equals(s.getIsActive())) {
      return false;
    }
    if (s.getScheduleDate() == null || !s.getScheduleDate().equals(today)) {
      return false;
    }
    LocalTime t = now.toLocalTime();
    LocalTime start = s.getStartTime();
    LocalTime end = s.getEndTime();
    if (start == null || end == null) {
      return false;
    }
    return !t.isBefore(start) && t.isBefore(end);
  }

  /**
   * Computes availability for UI. Booking module integration can plug in
   * {@code todayBookingCount} and refine FULLY_BOOKED_TODAY later.
   */
  public SmartAvailabilitySnapshot compute(
      Resource resource, List<ResourceStatusSchedule> schedulesForToday) {

    if (resource.getStatus() == ResourceStatus.OUT_OF_SERVICE) {
      return new SmartAvailabilitySnapshot(
          SmartAvailabilityStatus.OUT_OF_SERVICE.name(), null, null);
    }

    LocalDate today = LocalDate.now();
    LocalDateTime now = LocalDateTime.now();

    boolean inMaintenanceWindow =
        schedulesForToday.stream()
            .anyMatch(
                s ->
                    s.getScheduledStatus() == ScheduledStatus.OUT_OF_SERVICE
                        && isNowWithinSchedule(s, today, now));

    if (inMaintenanceWindow) {
      return new SmartAvailabilitySnapshot(
          SmartAvailabilityStatus.OUT_OF_SERVICE.name(), null, null);
    }

    LocalDateTime nextStart =
        schedulesForToday.stream()
            .filter(s -> Boolean.TRUE.equals(s.getIsActive()))
            .filter(s -> s.getScheduledStatus() == ScheduledStatus.ACTIVE)
            .filter(s -> s.getScheduleDate() != null && s.getScheduleDate().equals(today))
            .map(s -> LocalDateTime.of(s.getScheduleDate(), s.getStartTime()))
            .filter(dt -> dt.isAfter(now))
            .min(Comparator.naturalOrder())
            .orElse(null);

    if (nextStart != null
        && java.time.Duration.between(now, nextStart).toMinutes() <= BUSY_SOON_WINDOW_MINUTES) {
      return new SmartAvailabilitySnapshot(
          SmartAvailabilityStatus.BUSY_SOON.name(),
          nextStart.toLocalTime().toString(),
          null);
    }

    return new SmartAvailabilitySnapshot(
        SmartAvailabilityStatus.AVAILABLE_NOW.name(), null, null);
  }
}
