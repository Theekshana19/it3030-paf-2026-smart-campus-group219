package lk.sliit.smartcampus.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceTagBulkAssignRequest {

  @NotEmpty private List<Long> resourceIds;

  @NotEmpty private List<Long> tagIds;
}
