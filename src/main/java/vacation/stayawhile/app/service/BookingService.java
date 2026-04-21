package vacation.stayawhile.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vacation.stayawhile.app.model.Booking;
import vacation.stayawhile.app.model.BookingStatus;
import vacation.stayawhile.app.model.User;
import vacation.stayawhile.app.model.VacationProperty;
import vacation.stayawhile.app.repository.BookingRepository;
import vacation.stayawhile.app.repository.VacationPropertyRepository;
import vacation.stayawhile.app.repository.UserRepository;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private VacationPropertyRepository propertyRepository;
    
    @Autowired
    private UserService userService;
    
    public Booking createBooking(Booking booking) {
        // Validate dates
        if (booking.getArrivalDate().isAfter(booking.getDepartureDate())) {
            throw new RuntimeException("Arrival date must be before departure date");
        }
        
        if (booking.getArrivalDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Arrival date cannot be in the past");
        }
        
        // Validate property exists
        VacationProperty property = propertyRepository.findById(booking.getProperty().get_id())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        
        // Validate and set user
        User user;
        if (booking.getUser() != null) {
            if (booking.getUser().getId() != null) {
                // Try to find existing user by ID
                Optional<User> existingUser = userRepository.findById(booking.getUser().getId());
                if (existingUser.isPresent()) {
                    user = existingUser.get();
                } else {
                    // User ID provided but not found - create new user
                    user = userService.createUser(booking.getUser());
                }
            } else if (booking.getUser().getUserId() != null) {
                // Try to find existing user by userId
                Optional<User> existingUser = userRepository.findByUserId(booking.getUser().getUserId());
                if (existingUser.isPresent()) {
                    user = existingUser.get();
                } else {
                    // User userId provided but not found - create new user
                    user = userService.createUser(booking.getUser());
                }
            } else {
                // Create new user if complete user object is provided
                user = userService.createUser(booking.getUser());
            }
        } else {
            throw new RuntimeException("User information is required");
        }
        
        booking.setUser(user);
        
        // Check for overlapping bookings
//        List<Booking> overlappingBookings = bookingRepository.findOverlappingBookings(
//                property.get_id(),
//                booking.getArrivalDate(),
//                booking.getDepartureDate());
//        
//        if (!overlappingBookings.isEmpty()) {
//            throw new RuntimeException("Property is already booked for these dates");
//        }
        
        // Calculate total amount if not provided
        if (booking.getTotalAmount() == null && property.getPrices() != null) {
            long nights = ChronoUnit.DAYS.between(booking.getArrivalDate(), booking.getDepartureDate());
            double nightlyRate = property.getPrices().getBasePrice();
            
            // Set individual fare components
            booking.setAccommodationFare(nightlyRate * nights);
            booking.setCleaningFee(booking.getCleaningFee() != null ? booking.getCleaningFee() : 550.00);
            booking.setCreditCardProcessingFee(booking.getCreditCardProcessingFee() != null ? booking.getCreditCardProcessingFee() : 675.25);
            booking.setDamageWaiver(booking.getDamageWaiver() != null ? booking.getDamageWaiver() : 1000.00);
            booking.setTransientOccupancyTax(booking.getTransientOccupancyTax() != null ? booking.getTransientOccupancyTax() : 1724.00);
            
            // Calculate total
            double total = booking.getAccommodationFare() + 
                          booking.getCleaningFee() + 
                          booking.getCreditCardProcessingFee() + 
                          booking.getDamageWaiver() + 
                          booking.getTransientOccupancyTax();
            
            booking.setTotalAmount(total);
            booking.setCurrency(property.getPrices().getCurrency());
        }
        
        booking.setCreatedAt(LocalDate.now());
        booking.setUpdatedAt(LocalDate.now());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Fetch and set complete user object
        User completeUser = userRepository.findById(savedBooking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        savedBooking.setUser(completeUser);
        
        // Fetch and set complete property object
        VacationProperty completeProperty = propertyRepository.findById(savedBooking.getProperty().get_id())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        savedBooking.setProperty(completeProperty);
        
        System.out.println("Created booking with reference: " + savedBooking.getBookingReference());
        System.out.println("Property: " + savedBooking.getProperty().getTitle());
        System.out.println("Guest: " + savedBooking.getUser().getFirstName() + " " + savedBooking.getUser().getLastName());
        System.out.println("Dates: " + savedBooking.getArrivalDate() + " to " + savedBooking.getDepartureDate());
        System.out.println("Guests: " + savedBooking.getNumberOfGuests());
        System.out.println("Total Amount: $" + savedBooking.getTotalAmount());
        
        return savedBooking;
    }
    
    public List<Booking> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        
        // Fetch complete user and property objects for each booking
        for (Booking booking : bookings) {
            if (booking.getUser() != null && booking.getUser().getId() != null) {
                User completeUser = userRepository.findById(booking.getUser().getId()).orElse(null);
                if (completeUser != null) {
                    booking.setUser(completeUser);
                }
            }
            
            if (booking.getProperty() != null && booking.getProperty().get_id() != null) {
                VacationProperty completeProperty = propertyRepository.findById(booking.getProperty().get_id()).orElse(null);
                if (completeProperty != null) {
                    booking.setProperty(completeProperty);
                }
            }
        }
        
        return bookings;
    }
    
    public Optional<Booking> getBookingById(Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        
        if (booking.isPresent()) {
            Booking b = booking.get();
            
            // Fetch complete user object
            if (b.getUser() != null && b.getUser().getId() != null) {
                User completeUser = userRepository.findById(b.getUser().getId()).orElse(null);
                if (completeUser != null) {
                    b.setUser(completeUser);
                }
            }
            
            // Fetch complete property object
            if (b.getProperty() != null && b.getProperty().get_id() != null) {
                VacationProperty completeProperty = propertyRepository.findById(b.getProperty().get_id()).orElse(null);
                if (completeProperty != null) {
                    b.setProperty(completeProperty);
                }
            }
            
            return Optional.of(b);
        }
        
        return Optional.empty();
    }
    
    public Optional<Booking> getBookingByReference(String reference) {
        return bookingRepository.findByBookingReference(reference);
    }
    
    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user);
    }
    
    public List<Booking> getBookingsByProperty(String propertyId) {
        VacationProperty property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return bookingRepository.findByProperty_id(propertyId);
    }
    
    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setArrivalDate(bookingDetails.getArrivalDate());
        booking.setDepartureDate(bookingDetails.getDepartureDate());
        booking.setNumberOfGuests(bookingDetails.getNumberOfGuests());
        
        // Update fare components
        booking.setAccommodationFare(bookingDetails.getAccommodationFare());
        booking.setCleaningFee(bookingDetails.getCleaningFee());
        booking.setCreditCardProcessingFee(bookingDetails.getCreditCardProcessingFee());
        booking.setDamageWaiver(bookingDetails.getDamageWaiver());
        booking.setTransientOccupancyTax(bookingDetails.getTransientOccupancyTax());
        
        // Recalculate total if fare components are provided
        if (bookingDetails.getAccommodationFare() != null || 
            bookingDetails.getCleaningFee() != null || 
            bookingDetails.getCreditCardProcessingFee() != null || 
            bookingDetails.getDamageWaiver() != null || 
            bookingDetails.getTransientOccupancyTax() != null) {
            
            double accommodation = booking.getAccommodationFare() != null ? booking.getAccommodationFare() : 0.0;
            double cleaning = booking.getCleaningFee() != null ? booking.getCleaningFee() : 0.0;
            double processing = booking.getCreditCardProcessingFee() != null ? booking.getCreditCardProcessingFee() : 0.0;
            double damage = booking.getDamageWaiver() != null ? booking.getDamageWaiver() : 0.0;
            double tax = booking.getTransientOccupancyTax() != null ? booking.getTransientOccupancyTax() : 0.0;
            
            booking.setTotalAmount(accommodation + cleaning + processing + damage + tax);
        } else {
            booking.setTotalAmount(bookingDetails.getTotalAmount());
        }
        
        booking.setCurrency(bookingDetails.getCurrency());
        booking.setSpecialRequests(bookingDetails.getSpecialRequests());
        booking.setBookingStatus(bookingDetails.getBookingStatus());
        booking.setUpdatedAt(LocalDate.now());
        
        return bookingRepository.save(booking);
    }
    
    public void cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDate.now());
        bookingRepository.save(booking);
        
        System.out.println("Cancelled booking: " + booking.getBookingReference());
    }
    
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new RuntimeException("Booking not found with id: " + id);
        }
        bookingRepository.deleteById(id);
        System.out.println("Deleted booking with ID: " + id);
    }
    
    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByBookingStatus(status);
    }
    
    public List<Booking> getBookingsInDateRange(LocalDate startDate, LocalDate endDate) {
        return bookingRepository.findByArrivalDateBetweenAndDepartureDateBetween(
                startDate, endDate, startDate, endDate);
    }
}
