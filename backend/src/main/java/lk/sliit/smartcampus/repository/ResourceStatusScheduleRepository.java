package lk.sliit.smartcampus.repository;

import java.time.LocalDate;
import java.util.List;
import lk.sliit.smartcampus.entity.ResourceStatusSchedule;
import lk.sliit.smartcampus.enums.ResourceType;
import lk.sliit.smartcampus.enums.ScheduledStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResourceStatusScheduleRepository
    extends JpaRepository<ResourceStatusSchedule, Long> {

  List<ResourceStatusSchedule> findByResource_ResourceIdOrderByScheduleDateAscStartTimeAsc(
      Long resourceId);

  List<ResourceStatusSchedule> findByResource_ResourceIdAndScheduleDate(
      Long resourceId, LocalDate scheduleDate);

  List<ResourceStatusSchedule> findByScheduleDate(LocalDate scheduleDate);

  @Query("select s from ResourceStatusSchedule s join fetch s.resource r order by s.updatedAt desc")
  Page<ResourceStatusSchedule> findRecentUpdated(Pageable pageable);

  void deleteByResource_ResourceId(Long resourceId);

  @Query("""
      select s
      from ResourceStatusSchedule s
      join fetch s.resource r
      where (:search is null or
             lower(r.resourceName) like lower(concat('%', :search, '%')) or
             lower(r.resourceCode) like lower(concat('%', :search, '%')))
        and (:resourceType is null or r.resourceType = :resourceType)
        and (:building is null or lower(r.building) = lower(:building))
        and (:status is null or s.scheduledStatus = :status)
        and (:fromDate is null or s.scheduleDate >= :fromDate)
        and (:toDate is null or s.scheduleDate <= :toDate)
      order by s.scheduleDate asc, s.startTime asc
      """)
  List<ResourceStatusSchedule> findForGlobalOverview(
      @Param("search") String search,
      @Param("resourceType") ResourceType resourceType,
      @Param("building") String building,
      @Param("status") ScheduledStatus status,
      @Param("fromDate") LocalDate fromDate,
      @Param("toDate") LocalDate toDate);
}
