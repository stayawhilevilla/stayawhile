package vacation.stayawhile.app.model;

import javax.persistence.Embeddable;

@Embeddable
public class Reviews {
    private double avg;
    private int total;

    public Reviews() {}

    public double getAvg() {
        return avg;
    }

    public void setAvg(double avg) {
        this.avg = avg;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }
}
