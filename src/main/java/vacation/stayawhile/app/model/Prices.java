package vacation.stayawhile.app.model;

import javax.persistence.Embeddable;

@Embeddable
public class Prices {
    private double basePrice;
    private String currency;
    private double monthlyPriceFactor;
    private double weeklyPriceFactor;
    private Double extraPersonFee;
    private double cleaningFee;
    private double petFee;

    public Prices() {}

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public double getMonthlyPriceFactor() {
        return monthlyPriceFactor;
    }

    public void setMonthlyPriceFactor(double monthlyPriceFactor) {
        this.monthlyPriceFactor = monthlyPriceFactor;
    }

    public double getWeeklyPriceFactor() {
        return weeklyPriceFactor;
    }

    public void setWeeklyPriceFactor(double weeklyPriceFactor) {
        this.weeklyPriceFactor = weeklyPriceFactor;
    }

    public Double getExtraPersonFee() {
        return extraPersonFee;
    }

    public void setExtraPersonFee(Double extraPersonFee) {
        this.extraPersonFee = extraPersonFee;
    }

    public double getCleaningFee() {
        return cleaningFee;
    }

    public void setCleaningFee(double cleaningFee) {
        this.cleaningFee = cleaningFee;
    }

    public double getPetFee() {
        return petFee;
    }

    public void setPetFee(double petFee) {
        this.petFee = petFee;
    }
}
