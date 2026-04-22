package lk.sliit.smartcampus.service;

import java.time.LocalDate;
import lk.sliit.smartcampus.dto.response.StatusSchedulingOverviewResponse;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.enums.ScheduledStatus;

public interface StatusSchedulingOverviewService {
  StatusSchedulingOverviewResponse getOverview(
      String search,
      ResourceType resourceType,
      String building,
      ScheduledStatus status,
      LocalDate fromDate,
      LocalDate toDate);
}

