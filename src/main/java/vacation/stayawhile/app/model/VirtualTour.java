package vacation.stayawhile.app.model;

import javax.persistence.Embeddable;

@Embeddable
public class VirtualTour {
    private String url;
    private String id;

    public VirtualTour() {}

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
