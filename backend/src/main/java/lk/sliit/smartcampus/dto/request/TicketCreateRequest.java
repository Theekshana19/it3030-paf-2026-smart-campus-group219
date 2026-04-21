package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lk.sliit.smartcampus.enums.TicketCategory;
import lk.sliit.smartcampus.enums.TicketPriority;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketCreateRequest {

  // resource is optional because some issues are about general locations
  private Long resourceId;

  @NotBlank
  @Size(max = 200)
  private String locationDesc;

  @NotNull
  private TicketCategory category;

  @NotBlank
  @Size(max = 200)
  private String title;

  @NotBlank
  @Size(min = 10, max = 2000)
  private String description;

  @NotNull
  private TicketPriority priority;

  @Email
  @NotBlank
  @Size(max = 150)
  private String reporterEmail;

  @NotBlank
  @Size(max = 100)
  private String reporterName;

  @Size(max = 20)
  private String contactPhone;

  @Size(max = 30)
  private String contactMethod;
}
