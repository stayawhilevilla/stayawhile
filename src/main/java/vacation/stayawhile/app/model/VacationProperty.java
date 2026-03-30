package vacation.stayawhile.app.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "vacation_properties")
public class VacationProperty {
    @Id
    @Column(name = "property_id")
    private String _id;
    
    @Column(name = "account_id")
    private String accountId;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "nickname")
    private String nickname;
    
    @Column(name = "type")
    private String type;
    
    @Column(name = "room_type")
    private String roomType;
    
    @Column(name = "property_type")
    private String propertyType;
    
    @Column(name = "accommodates")
    private int accommodates;
    
    @ElementCollection
    @CollectionTable(name = "property_amenities", joinColumns = @JoinColumn(name = "property_id"))
    private List<Amenity> amenities;
    
    @Column(name = "bathrooms")
    private int bathrooms;
    
    @Column(name = "bedrooms")
    private int bedrooms;
    
    @Column(name = "beds")
    private int beds;
    
    @Column(name = "bed_type")
    private String bedType;
    
    @Column(name = "timezone")
    private String timezone;
    
    @Column(name = "default_check_in_time")
    private String defaultCheckInTime;
    
    @Column(name = "default_check_out_time")
    private String defaultCheckOutTime;
    
    @Embedded
    private Address address;
    
    @Embedded
    private Picture picture;
    
    @ElementCollection
    @CollectionTable(name = "property_pictures", joinColumns = @JoinColumn(name = "property_id"))
    private List<Picture> pictures;
    
    @Embedded
    private Prices prices;
    
    @Embedded
    private PublicDescription publicDescription;
    
    @Embedded
    private Terms terms;
    
    @Transient
    private List<Object> taxes; // Using @Transient to skip DB persistence for complex structure
    
    @Embedded
    private Reviews reviews;
    
    @ElementCollection
    @CollectionTable(name = "property_tags", joinColumns = @JoinColumn(name = "property_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(name = "area_square_feet")
    private int areaSquareFeet;
    
    @Column(name = "parent_id")
    private String parentId;
    
    @Transient
    private Object image; // Complex image object - not persisted
    
    @Transient
    private List<Object> testimonials; // Complex testimonial objects - not persisted
    
    @Column(name = "testimonial_fallback_image")
    private String testimonialFallbackImage;
    
    @Embedded
    private VirtualTour virtualTour;
    
    @ElementCollection
    @CollectionTable(name = "nearby_properties", joinColumns = @JoinColumn(name = "property_id"))
    private List<NearbyProperty> nearbyProperties;
    
    @Column(name = "matterport_url")
    private String matterportUrl;

    public VacationProperty() {}

    // Getters and Setters
    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public int getAccommodates() {
        return accommodates;
    }

    public void setAccommodates(int accommodates) {
        this.accommodates = accommodates;
    }

    public List<Amenity> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<Amenity> amenities) {
        this.amenities = amenities;
    }

    public int getBathrooms() {
        return bathrooms;
    }

    public void setBathrooms(int bathrooms) {
        this.bathrooms = bathrooms;
    }

    public int getBedrooms() {
        return bedrooms;
    }

    public void setBedrooms(int bedrooms) {
        this.bedrooms = bedrooms;
    }

    public int getBeds() {
        return beds;
    }

    public void setBeds(int beds) {
        this.beds = beds;
    }

    public String getBedType() {
        return bedType;
    }

    public void setBedType(String bedType) {
        this.bedType = bedType;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getDefaultCheckInTime() {
        return defaultCheckInTime;
    }

    public void setDefaultCheckInTime(String defaultCheckInTime) {
        this.defaultCheckInTime = defaultCheckInTime;
    }

    public String getDefaultCheckOutTime() {
        return defaultCheckOutTime;
    }

    public void setDefaultCheckOutTime(String defaultCheckOutTime) {
        this.defaultCheckOutTime = defaultCheckOutTime;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Picture getPicture() {
        return picture;
    }

    public void setPicture(Picture picture) {
        this.picture = picture;
    }

    public List<Picture> getPictures() {
        return pictures;
    }

    public void setPictures(List<Picture> pictures) {
        this.pictures = pictures;
    }

    public Prices getPrices() {
        return prices;
    }

    public void setPrices(Prices prices) {
        this.prices = prices;
    }

    public PublicDescription getPublicDescription() {
        return publicDescription;
    }

    public void setPublicDescription(PublicDescription publicDescription) {
        this.publicDescription = publicDescription;
    }

    public Terms getTerms() {
        return terms;
    }

    public void setTerms(Terms terms) {
        this.terms = terms;
    }

    public List<Object> getTaxes() {
        return taxes;
    }

    public void setTaxes(List<Object> taxes) {
        this.taxes = taxes;
    }

    public Reviews getReviews() {
        return reviews;
    }

    public void setReviews(Reviews reviews) {
        this.reviews = reviews;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public int getAreaSquareFeet() {
        return areaSquareFeet;
    }

    public void setAreaSquareFeet(int areaSquareFeet) {
        this.areaSquareFeet = areaSquareFeet;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public Object getImage() {
        return image;
    }

    public void setImage(Object image) {
        this.image = image;
    }

    public List<Object> getTestimonials() {
        return testimonials;
    }

    public void setTestimonials(List<Object> testimonials) {
        this.testimonials = testimonials;
    }

    public String getTestimonialFallbackImage() {
        return testimonialFallbackImage;
    }

    public void setTestimonialFallbackImage(String testimonialFallbackImage) {
        this.testimonialFallbackImage = testimonialFallbackImage;
    }

    public VirtualTour getVirtualTour() {
        return virtualTour;
    }

    public void setVirtualTour(VirtualTour virtualTour) {
        this.virtualTour = virtualTour;
    }

    public List<NearbyProperty> getNearbyProperties() {
        return nearbyProperties;
    }

    public void setNearbyProperties(List<NearbyProperty> nearbyProperties) {
        this.nearbyProperties = nearbyProperties;
    }

    public String getMatterportUrl() {
        return matterportUrl;
    }

    public void setMatterportUrl(String matterportUrl) {
        this.matterportUrl = matterportUrl;
    }
}
