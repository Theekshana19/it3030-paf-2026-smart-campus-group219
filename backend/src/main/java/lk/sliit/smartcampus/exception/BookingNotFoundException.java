package lk.sliit.smartcampus.exception;

public class BookingNotFoundException extends RuntimeException {

  public BookingNotFoundException(Long bookingId) {
    super("Booking not found: " + bookingId);
  }
}
