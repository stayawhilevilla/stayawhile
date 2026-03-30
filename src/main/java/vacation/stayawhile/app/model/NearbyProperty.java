package vacation.stayawhile.app.model;

import javax.persistence.Embeddable;

@Embeddable
public class NearbyProperty {
    private String id;
    private String name;
    private String image;
    private String url;

    public NearbyProperty() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
