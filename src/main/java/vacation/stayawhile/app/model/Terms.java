package vacation.stayawhile.app.model;

import javax.persistence.Embeddable;

@Embeddable
public class Terms {
    private int minNights;
    private int maxNights;

    public Terms() {}

    public int getMinNights() {
        return minNights;
    }

    public void setMinNights(int minNights) {
        this.minNights = minNights;
    }

    public int getMaxNights() {
        return maxNights;
    }

    public void setMaxNights(int maxNights) {
        this.maxNights = maxNights;
    }
}
