package lk.sliit.smartcampus.repository;

import java.time.LocalDate;
import java.util.List;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResourceStatusScheduleRepository
    extends JpaRepository<ResourceStatusSchedule, Long> {

  List<ResourceStatusSchedule> findByResource_ResourceIdOrderByScheduleDateAscStartTimeAsc(
      Long resourceId);

  List<ResourceStatusSchedule> findByResource_ResourceIdAndScheduleDate(
      Long resourceId, LocalDate scheduleDate);
}
