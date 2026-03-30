package vacation.stayawhile.app.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Picture {
    private String original;
    private String thumbnail;
    @Column(columnDefinition = "TEXT")
    private String caption;

    public Picture() {}

    public Picture(String original, String thumbnail, String caption) {
        this.original = original;
        this.thumbnail = thumbnail;
        this.caption = caption;
    }

    public String getOriginal() {
        return original;
    }

    public void setOriginal(String original) {
        this.original = original;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getCaption() {
        return caption;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }
}
