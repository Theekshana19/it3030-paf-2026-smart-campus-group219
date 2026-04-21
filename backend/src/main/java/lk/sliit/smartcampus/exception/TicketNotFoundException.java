package lk.sliit.smartcampus.exception;

public class TicketNotFoundException extends RuntimeException {

  public TicketNotFoundException(Long ticketId) {
    super("Ticket not found: " + ticketId);
  }
}
