package vacation.stayawhile.app.repository;

import vacation.stayawhile.app.model.Booking;
import vacation.stayawhile.app.model.BookingStatus;
import vacation.stayawhile.app.model.User;
import vacation.stayawhile.app.model.VacationProperty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find by booking reference
    Optional<Booking> findByBookingReference(String bookingReference);
    
    // Find bookings by user
    List<Booking> findByUser(User user);
    
    // Find bookings by user ID
    List<Booking> findByUserId(Long userId);
    
    // Find bookings by property
    List<Booking> findByProperty(VacationProperty property);
    
    // Find bookings by property ID
    @Query("SELECT b FROM Booking b WHERE b.property._id = :propertyId")
    List<Booking> findByProperty_id(@Param("propertyId") String propertyId);
    
    // Find bookings by status
    List<Booking> findByBookingStatus(BookingStatus bookingStatus);
    
    // Find bookings by date range
    List<Booking> findByArrivalDateBetweenAndDepartureDateBetween(
        LocalDate startArrival, LocalDate endArrival,
        LocalDate startDeparture, LocalDate endDeparture);
    
    // Find bookings overlapping with given dates for a property
    @Query("SELECT b FROM Booking b WHERE b.property._id = :propertyId AND " +
           "((b.arrivalDate <= :endDate AND b.departureDate >= :startDate) AND " +
           "b.bookingStatus NOT IN ('CANCELLED', 'REFUNDED'))")
    List<Booking> findOverlappingBookings(
        @Param("propertyId") String propertyId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate);
    
    // Count bookings by user
    long countByUser(User user);
    
    // Count bookings by property
    long countByProperty(VacationProperty property);
}
