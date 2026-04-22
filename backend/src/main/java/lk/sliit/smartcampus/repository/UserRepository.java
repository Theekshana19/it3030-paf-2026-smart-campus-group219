package lk.sliit.smartcampus.repository;

import java.util.Optional;
import lk.sliit.smartcampus.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByGoogleSub(String googleSub);

  Optional<User> findByEmailIgnoreCase(String email);
}

