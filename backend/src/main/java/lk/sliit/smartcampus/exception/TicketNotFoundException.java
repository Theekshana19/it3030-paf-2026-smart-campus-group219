package lk.sliit.smartcampus.exception;

public class TicketNotFoundException extends RuntimeException {

  public TicketNotFoundException(Long ticketId) {
    super("Ticket with ID " + ticketId + " was not found in system");
  }
}
