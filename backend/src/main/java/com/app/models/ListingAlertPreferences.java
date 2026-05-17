package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "listing_alert_preferences", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"listing_id", "audience"})
})
public class ListingAlertPreferences {

    @Id
    @Column(name = "listing_alert_preference_id", nullable = false, updatable = false)
    private UUID listingAlertPreferenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @JsonIgnore
    private FoodListings listing;

    @Column(name = "audience", nullable = false, length = 64)
    private String audience;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    protected void prePersist() {
        if (listingAlertPreferenceId == null) {
            listingAlertPreferenceId = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    public UUID getListingAlertPreferenceId() {
        return listingAlertPreferenceId;
    }

    public void setListingAlertPreferenceId(UUID listingAlertPreferenceId) {
        this.listingAlertPreferenceId = listingAlertPreferenceId;
    }

    public FoodListings getListing() {
        return listing;
    }

    public void setListing(FoodListings listing) {
        this.listing = listing;
    }

    public String getAudience() {
        return audience;
    }

    public void setAudience(String audience) {
        this.audience = audience;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
