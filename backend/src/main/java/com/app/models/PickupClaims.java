package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "pickup_claims", indexes = {
        @Index(name = "idx_pickup_claims_listing", columnList = "listing_id"),
        @Index(name = "idx_pickup_claims_recipient", columnList = "recipient_organization_id"),
        @Index(name = "idx_pickup_claims_volunteer", columnList = "volunteer_user_id"),
        @Index(name = "idx_pickup_claims_status", columnList = "status")
})
public class PickupClaims {

    @Id
    @Column(name = "claim_id", nullable = false, updatable = false)
    private UUID claimId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    @JsonIgnore
    private FoodListings listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_organization_id", nullable = false)
    @JsonIgnore
    private Organization recipientOrganization;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "volunteer_user_id")
    @JsonIgnore
    private AppUsers volunteerUser;

    @Column(name = "status", nullable = false, length = 32)
    private String status = "CLAIMED";

    @Column(name = "claimed_at", nullable = false)
    private OffsetDateTime claimedAt;

    @Column(name = "picked_up_at")
    private OffsetDateTime pickedUpAt;

    @Column(name = "delivered_at")
    private OffsetDateTime deliveredAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void prePersist() {
        if (claimId == null) {
            claimId = UUID.randomUUID();
        }
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (updatedAt == null) {
            updatedAt = OffsetDateTime.now();
        }
        if (claimedAt == null) {
            claimedAt = OffsetDateTime.now();
        }
    }

    @PreUpdate
    protected void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getClaimId() {
        return claimId;
    }

    public void setClaimId(UUID claimId) {
        this.claimId = claimId;
    }

    public FoodListings getListing() {
        return listing;
    }

    public void setListing(FoodListings listing) {
        this.listing = listing;
    }

    public Organization getRecipientOrganization() {
        return recipientOrganization;
    }

    public void setRecipientOrganization(Organization recipientOrganization) {
        this.recipientOrganization = recipientOrganization;
    }

    public AppUsers getVolunteerUser() {
        return volunteerUser;
    }

    public void setVolunteerUser(AppUsers volunteerUser) {
        this.volunteerUser = volunteerUser;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getClaimedAt() {
        return claimedAt;
    }

    public void setClaimedAt(OffsetDateTime claimedAt) {
        this.claimedAt = claimedAt;
    }

    public OffsetDateTime getPickedUpAt() {
        return pickedUpAt;
    }

    public void setPickedUpAt(OffsetDateTime pickedUpAt) {
        this.pickedUpAt = pickedUpAt;
    }

    public OffsetDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(OffsetDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
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
}
