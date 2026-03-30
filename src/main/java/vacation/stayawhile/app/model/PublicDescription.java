package vacation.stayawhile.app.model;

import javax.persistence.Embeddable;
import javax.persistence.Column;

@Embeddable
public class PublicDescription {
    @Column(columnDefinition = "TEXT")
    private String space;
    @Column(columnDefinition = "TEXT")
    private String access;
    @Column(columnDefinition = "TEXT")
    private String neighborhood;
    @Column(columnDefinition = "TEXT")
    private String transit;
    @Column(columnDefinition = "TEXT")
    private String notes;
    @Column(columnDefinition = "TEXT")
    private String interactionWithGuests;
    @Column(columnDefinition = "TEXT")
    private String summary;
    @Column(columnDefinition = "TEXT")
    private String houseRules;
    @Column(name = "full_description", columnDefinition = "TEXT")
    private String full;

    public PublicDescription() {}

    public String getSpace() {
        return space;
    }

    public void setSpace(String space) {
        this.space = space;
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
        this.access = access;
    }

    public String getNeighborhood() {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) {
        this.neighborhood = neighborhood;
    }

    public String getTransit() {
        return transit;
    }

    public void setTransit(String transit) {
        this.transit = transit;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getInteractionWithGuests() {
        return interactionWithGuests;
    }

    public void setInteractionWithGuests(String interactionWithGuests) {
        this.interactionWithGuests = interactionWithGuests;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getHouseRules() {
        return houseRules;
    }

    public void setHouseRules(String houseRules) {
        this.houseRules = houseRules;
    }

    public String getFull() {
        return full;
    }

    public void setFull(String full) {
        this.full = full;
    }
}
