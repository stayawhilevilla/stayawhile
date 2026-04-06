package vacation.stayawhile.app.model;

import vacation.stayawhile.app.model.BookingStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "booking_reference", unique = true, nullable = false)
    private String bookingReference;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private VacationProperty property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;
    
    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;
    
    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;
    
    @Column(name = "number_of_guests", nullable = false)
    private int numberOfGuests;
    
    // Fare Components
    @Column(name = "accommodation_fare")
    private Double accommodationFare;
    
    @Column(name = "cleaning_fee")
    private Double cleaningFee;
    
    @Column(name = "credit_card_processing_fee")
    private Double creditCardProcessingFee;
    
    @Column(name = "damage_waiver")
    private Double damageWaiver;
    
    @Column(name = "transient_occupancy_tax")
    private Double transientOccupancyTax;
    
    @Column(name = "total_amount")
    private Double totalAmount;
    
    @Column(name = "currency")
    private String currency = "USD";
    
    @Column(name = "booking_status")
    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;
    
    @Column(name = "special_requests", columnDefinition = "TEXT")
    private String specialRequests;
    
    @Column(name = "created_at")
    private LocalDate createdAt;
    
    @Column(name = "updated_at")
    private LocalDate updatedAt;
    
    public Booking() {
        this.createdAt = LocalDate.now();
        this.updatedAt = LocalDate.now();
        this.bookingStatus = BookingStatus.PENDING;
        this.bookingReference = generateBookingReference();
    }
    
    private String generateBookingReference() {
        return "BK" + System.currentTimeMillis() + (int)(Math.random() * 1000);
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBookingReference() {
        return bookingReference;
    }
    
    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
    }
    
    public VacationProperty getProperty() {
        return property;
    }
    
    public void setProperty(VacationProperty property) {
        this.property = property;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public LocalDate getArrivalDate() {
        return arrivalDate;
    }
    
    public void setArrivalDate(LocalDate arrivalDate) {
        this.arrivalDate = arrivalDate;
    }
    
    public LocalDate getDepartureDate() {
        return departureDate;
    }
    
    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }
    
    public int getNumberOfGuests() {
        return numberOfGuests;
    }
    
    public void setNumberOfGuests(int numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }
    
    public Double getAccommodationFare() {
        return accommodationFare;
    }
    
    public void setAccommodationFare(Double accommodationFare) {
        this.accommodationFare = accommodationFare;
    }
    
    public Double getCleaningFee() {
        return cleaningFee;
    }
    
    public void setCleaningFee(Double cleaningFee) {
        this.cleaningFee = cleaningFee;
    }
    
    public Double getCreditCardProcessingFee() {
        return creditCardProcessingFee;
    }
    
    public void setCreditCardProcessingFee(Double creditCardProcessingFee) {
        this.creditCardProcessingFee = creditCardProcessingFee;
    }
    
    public Double getDamageWaiver() {
        return damageWaiver;
    }
    
    public void setDamageWaiver(Double damageWaiver) {
        this.damageWaiver = damageWaiver;
    }
    
    public Double getTransientOccupancyTax() {
        return transientOccupancyTax;
    }
    
    public void setTransientOccupancyTax(Double transientOccupancyTax) {
        this.transientOccupancyTax = transientOccupancyTax;
    }
    
    public Double getTotalAmount() {
        return totalAmount;
    }
    
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }
    
    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }
    
    public String getSpecialRequests() {
        return specialRequests;
    }
    
    public void setSpecialRequests(String specialRequests) {
        this.specialRequests = specialRequests;
    }
    
    public LocalDate getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDate getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDate updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDate.now();
    }
}
