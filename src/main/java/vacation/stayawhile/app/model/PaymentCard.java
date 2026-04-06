package vacation.stayawhile.app.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class PaymentCard {
    @Column(name = "card_number")
    private String cardNumber;
    
    @Column(name = "cardholder_name")
    private String cardholderName;
    
    @Column(name = "expiry_month")
    private int expiryMonth;
    
    @Column(name = "expiry_year")
    private int expiryYear;
    
    @Column(name = "cvv")
    private String cvv;
    
    @Column(name = "card_type")
    private String cardType; // VISA, MASTERCARD, AMEX, etc.
    
    @Column(name = "billing_address_line1")
    private String billingAddressLine1;
    
    @Column(name = "billing_address_line2")
    private String billingAddressLine2;
    
    @Column(name = "billing_city")
    private String billingCity;
    
    @Column(name = "billing_state")
    private String billingState;
    
    @Column(name = "billing_postal_code")
    private String billingPostalCode;
    
    @Column(name = "billing_country")
    private String billingCountry;
    
    @Column(name = "is_default")
    private boolean isDefault;
    
    public PaymentCard() {}
    
    // Getters and Setters
    public String getCardNumber() {
        return cardNumber;
    }
    
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }
    
    public String getCardholderName() {
        return cardholderName;
    }
    
    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }
    
    public int getExpiryMonth() {
        return expiryMonth;
    }
    
    public void setExpiryMonth(int expiryMonth) {
        this.expiryMonth = expiryMonth;
    }
    
    public int getExpiryYear() {
        return expiryYear;
    }
    
    public void setExpiryYear(int expiryYear) {
        this.expiryYear = expiryYear;
    }
    
    public String getCvv() {
        return cvv;
    }
    
    public void setCvv(String cvv) {
        this.cvv = cvv;
    }
    
    public String getCardType() {
        return cardType;
    }
    
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
    
    public String getBillingAddressLine1() {
        return billingAddressLine1;
    }
    
    public void setBillingAddressLine1(String billingAddressLine1) {
        this.billingAddressLine1 = billingAddressLine1;
    }
    
    public String getBillingAddressLine2() {
        return billingAddressLine2;
    }
    
    public void setBillingAddressLine2(String billingAddressLine2) {
        this.billingAddressLine2 = billingAddressLine2;
    }
    
    public String getBillingCity() {
        return billingCity;
    }
    
    public void setBillingCity(String billingCity) {
        this.billingCity = billingCity;
    }
    
    public String getBillingState() {
        return billingState;
    }
    
    public void setBillingState(String billingState) {
        this.billingState = billingState;
    }
    
    public String getBillingPostalCode() {
        return billingPostalCode;
    }
    
    public void setBillingPostalCode(String billingPostalCode) {
        this.billingPostalCode = billingPostalCode;
    }
    
    public String getBillingCountry() {
        return billingCountry;
    }
    
    public void setBillingCountry(String billingCountry) {
        this.billingCountry = billingCountry;
    }
    
    public boolean isDefault() {
        return isDefault;
    }
    
    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }
}
