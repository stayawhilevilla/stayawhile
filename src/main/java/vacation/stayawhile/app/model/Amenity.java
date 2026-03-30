package vacation.stayawhile.app.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Amenity {
    @Column(columnDefinition = "TEXT")
    private String text;
    private String icon;

    public Amenity() {}

    public Amenity(String text, String icon) {
        this.text = text;
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
