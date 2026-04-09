package lk.sliit.smartcampus.mapper;

import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.response.BookingResponse;
import lk.sliit.smartcampus.entity.Booking;
import lk.sliit.smartcampus.entity.Resource;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

  // map create request to a new booking entity
  public Booking toNewEntity(BookingCreateRequest request, Resource resource) {
    return Booking.builder()
        .resource(resource)
        .userEmail(request.getUserEmail().trim())
        .userName(request.getUserName().trim())
        .bookingDate(request.getBookingDate())
        .startTime(request.getStartTime())
        .endTime(request.getEndTime())
        .purpose(request.getPurpose().trim())
        .expectedCount(request.getExpectedCount())
        .build();
  }

  // update existing booking entity from request
  public void apply(Booking entity, BookingCreateRequest request, Resource resource) {
    entity.setResource(resource);
    entity.setUserEmail(request.getUserEmail().trim());
    entity.setUserName(request.getUserName().trim());
    entity.setBookingDate(request.getBookingDate());
    entity.setStartTime(request.getStartTime());
    entity.setEndTime(request.getEndTime());
    entity.setPurpose(request.getPurpose().trim());
    entity.setExpectedCount(request.getExpectedCount());
  }

  // convert entity to response with resource details included
  public BookingResponse toResponse(Booking entity) {
    Resource res = entity.getResource();
    return BookingResponse.builder()
        .bookingId(entity.getBookingId())
        .bookingRef(entity.getBookingRef())
        .resourceId(res.getResourceId())
        .resourceName(res.getResourceName())
        .resourceCode(res.getResourceCode())
        .resourceType(res.getResourceType().name())
        .building(res.getBuilding())
        .capacity(res.getCapacity())
        .userEmail(entity.getUserEmail())
        .userName(entity.getUserName())
        .bookingDate(entity.getBookingDate())
        .startTime(entity.getStartTime())
        .endTime(entity.getEndTime())
        .purpose(entity.getPurpose())
        .expectedCount(entity.getExpectedCount())
        .bookingStatus(entity.getBookingStatus())
        .adminRemark(entity.getAdminRemark())
        .reviewedBy(entity.getReviewedBy())
        .reviewedAt(entity.getReviewedAt())
        .isActive(entity.getIsActive())
        .createdAt(entity.getCreatedAt())
        .updatedAt(entity.getUpdatedAt())
        .build();
  }
}
