package vacation.stayawhile.app.repository;

import vacation.stayawhile.app.model.User;
import vacation.stayawhile.app.model.UserRole;
import vacation.stayawhile.app.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Find by userId (custom unique identifier)
    Optional<User> findByUserId(String userId);
    
    // Find by username
    Optional<User> findByUsername(String username);
    
    // Find by email
    Optional<User> findByEmail(String email);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Check if userId exists
    boolean existsByUserId(String userId);
    
    // Find by role
    java.util.List<User> findByRole(UserRole role);
    
    // Find by status
    java.util.List<User> findByStatus(UserStatus status);
    
    // Find by role and status
    java.util.List<User> findByRoleAndStatus(UserRole role, UserStatus status);
}
