package smart_campus_backend.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import smart_campus_backend.auth.entity.AdminInvite;

public interface AdminInviteRepository extends JpaRepository<AdminInvite, Long> {
}
