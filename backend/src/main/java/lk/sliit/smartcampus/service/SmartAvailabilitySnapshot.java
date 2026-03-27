package lk.sliit.smartcampus.service;

public record SmartAvailabilitySnapshot(
    String smartAvailabilityStatus,
    String nextBookingTime,
    Integer todayBookingCount
) {}
