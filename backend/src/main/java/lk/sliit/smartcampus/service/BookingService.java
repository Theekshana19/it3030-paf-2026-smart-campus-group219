package lk.sliit.smartcampus.service;

import java.util.List;
import lk.sliit.smartcampus.dto.request.BookingCreateRequest;
import lk.sliit.smartcampus.dto.request.BookingDecisionRequest;
import lk.sliit.smartcampus.dto.response.BookingResponse;

public interface BookingService {

  BookingResponse create(BookingCreateRequest request, String googleToken);

  List<BookingResponse> listMine(String googleToken);

  List<BookingResponse> listPending(String googleToken);

  BookingResponse decide(Long bookingId, BookingDecisionRequest request, String googleToken);
}
