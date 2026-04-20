package lk.sliit.smartcampus.repository;

import java.util.List;
import lk.sliit.smartcampus.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

  List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
}

