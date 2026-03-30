package vacation.stayawhile.app.repository;

import vacation.stayawhile.app.model.VacationProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VacationPropertyRepository extends JpaRepository<VacationProperty, String> {
    
    // Find properties by title (case-insensitive)
    List<VacationProperty> findByTitleContainingIgnoreCase(String title);
    
    // Find properties by account ID
    List<VacationProperty> findByAccountId(String accountId);
    
    // Count properties by account ID
    long countByAccountId(String accountId);
}
