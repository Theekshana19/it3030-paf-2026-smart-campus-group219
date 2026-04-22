package lk.sliit.smartcampus.service;

import lk.sliit.smartcampus.dto.request.BulkStatusScheduleRequest;
import lk.sliit.smartcampus.dto.request.EmergencyOverrideRequest;
import lk.sliit.smartcampus.dto.request.StatusSchedulePrecheckRequest;
import lk.sliit.smartcampus.dto.response.BulkStatusScheduleResponse;
import lk.sliit.smartcampus.dto.response.EmergencyOverrideResponse;
import lk.sliit.smartcampus.dto.response.StatusSchedulePrecheckResponse;

public interface StatusScheduleBatchService {

  StatusSchedulePrecheckResponse precheck(StatusSchedulePrecheckRequest request);

  BulkStatusScheduleResponse bulkCreate(BulkStatusScheduleRequest request);

  EmergencyOverrideResponse emergencyOverride(EmergencyOverrideRequest request);
}
