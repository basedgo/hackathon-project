package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "food_listings", indexes = {
        @Index(name = "idx_food_listings_status_deadline", columnList = "status,pickup_window_ends_at"),
        @Index(name = "idx_food_listings_donor", columnList = "donor_organization_id"),
        @Index(name = "idx_food_listings_category", columnList = "category")
})
@JsonIgnoreProperties({"tags", "pickupClaims", "alertPreferences"})
public class FoodListings {

    @Id
    @Column(name = "listing_id", nullable = false, updatable = false)
    private UUID listingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "donor_organization_id", nullable = false)
    @JsonIgnore
    private Organization donorOrganization;

    @Column(name = "title", nullable = false, length = 180)
    private String title;

    @Column(name = "category", nullable = false, length = 80)
    private String category;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "quantity_label", nullable = false, length = 80)
    private String quantityLabel;

    @Column(name = "serving_count")
    private Integer servingCount;

    @Column(name = "pickup_instructions", columnDefinition = "text")
    private String pickupInstructions;

    @Column(name = "pickup_window_starts_at")
    private OffsetDateTime pickupWindowStartsAt;

    @Column(name = "pickup_window_ends_at", nullable = false)
    private OffsetDateTime pickupWindowEndsAt;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "AVAILABLE";

    @Column(name = "time_tone", nullable = false, length = 16)
    private String timeTone = "SOON";

    @Column(name = "distance_label", length = 40)
    private String distanceLabel;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "map_position_x", precision = 5, scale = 2)
    private BigDecimal mapPositionX;

    @Column(name = "map_position_y", precision = 5, scale = 2)
    private BigDecimal mapPositionY;

    @Column(name = "photo_url", length = 1024)
    private String photoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    @JsonIgnore
    private AppUsers createdByUser;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListingTags> tags = new ArrayList<>();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PickupClaims> pickupClaims = new ArrayList<>();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListingAlertPreferences> alertPreferences = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        if (listingId == null) {
            listingId = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getListingId() {
        return listingId;
    }

    public void setListingId(UUID listingId) {
        this.listingId = listingId;
    }

    public Organization getDonorOrganization() {
        return donorOrganization;
    }

    public void setDonorOrganization(Organization donorOrganization) {
        this.donorOrganization = donorOrganization;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuantityLabel() {
        return quantityLabel;
    }

    public void setQuantityLabel(String quantityLabel) {
        this.quantityLabel = quantityLabel;
    }

    public Integer getServingCount() {
        return servingCount;
    }

    public void setServingCount(Integer servingCount) {
        this.servingCount = servingCount;
    }

    public String getPickupInstructions() {
        return pickupInstructions;
    }

    public void setPickupInstructions(String pickupInstructions) {
        this.pickupInstructions = pickupInstructions;
    }

    public OffsetDateTime getPickupWindowStartsAt() {
        return pickupWindowStartsAt;
    }

    public void setPickupWindowStartsAt(OffsetDateTime pickupWindowStartsAt) {
        this.pickupWindowStartsAt = pickupWindowStartsAt;
    }

    public OffsetDateTime getPickupWindowEndsAt() {
        return pickupWindowEndsAt;
    }

    public void setPickupWindowEndsAt(OffsetDateTime pickupWindowEndsAt) {
        this.pickupWindowEndsAt = pickupWindowEndsAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimeTone() {
        return timeTone;
    }

    public void setTimeTone(String timeTone) {
        this.timeTone = timeTone;
    }

    public String getDistanceLabel() {
        return distanceLabel;
    }

    public void setDistanceLabel(String distanceLabel) {
        this.distanceLabel = distanceLabel;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public BigDecimal getMapPositionX() {
        return mapPositionX;
    }

    public void setMapPositionX(BigDecimal mapPositionX) {
        this.mapPositionX = mapPositionX;
    }

    public BigDecimal getMapPositionY() {
        return mapPositionY;
    }

    public void setMapPositionY(BigDecimal mapPositionY) {
        this.mapPositionY = mapPositionY;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public AppUsers getCreatedByUser() {
        return createdByUser;
    }

    public void setCreatedByUser(AppUsers createdByUser) {
        this.createdByUser = createdByUser;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ListingTags> getTags() {
        return tags;
    }

    public void setTags(List<ListingTags> tags) {
        this.tags = tags;
    }

    public List<PickupClaims> getPickupClaims() {
        return pickupClaims;
    }

    public void setPickupClaims(List<PickupClaims> pickupClaims) {
        this.pickupClaims = pickupClaims;
    }

    public List<ListingAlertPreferences> getAlertPreferences() {
        return alertPreferences;
    }

    public void setAlertPreferences(List<ListingAlertPreferences> alertPreferences) {
        this.alertPreferences = alertPreferences;
    }
}
