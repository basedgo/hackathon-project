package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "organizations", indexes = {
        @Index(name = "idx_organizations_type", columnList = "organization_type"),
        @Index(name = "idx_organizations_location", columnList = "city,state_code,postal_code")
})
@JsonIgnoreProperties({"users", "donations", "receivedClaims"})
public class Organization {

    @Id
    @Column(name = "organization_id", nullable = false, updatable = false)
    private UUID organizationId;

    @Column(name = "name", nullable = false, length = 160)
    private String name;

    @Column(name = "organization_type", nullable = false, length = 32)
    private String organizationType;

    @Column(name = "display_initials", length = 8)
    private String displayInitials;

    @Column(name = "contact_name", length = 120)
    private String contactName;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "contact_phone", length = 40)
    private String contactPhone;

    @Column(name = "street_address", length = 255)
    private String streetAddress;

    @Column(name = "city", nullable = false, length = 120)
    private String city = "Seattle";

    @Column(name = "state_code", nullable = false, length = 2)
    private String stateCode = "WA";

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "latitude", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "service_radius_miles", precision = 5, scale = 2)
    private BigDecimal serviceRadiusMiles;

    @Column(name = "capacity_notes", columnDefinition = "text")
    private String capacityNotes;

    @Column(name = "sns_topic_arn", length = 512)
    private String snsTopicArn;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AppUsers> users = new ArrayList<>();

    @OneToMany(mappedBy = "donorOrganization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FoodListings> donations = new ArrayList<>();

    @OneToMany(mappedBy = "recipientOrganization", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PickupClaims> receivedClaims = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        if (organizationId == null) {
            organizationId = UUID.randomUUID();
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

    public UUID getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(UUID organizationId) {
        this.organizationId = organizationId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOrganizationType() {
        return organizationType;
    }

    public void setOrganizationType(String organizationType) {
        this.organizationType = organizationType;
    }

    public String getDisplayInitials() {
        return displayInitials;
    }

    public void setDisplayInitials(String displayInitials) {
        this.displayInitials = displayInitials;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStateCode() {
        return stateCode;
    }

    public void setStateCode(String stateCode) {
        this.stateCode = stateCode;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
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

    public BigDecimal getServiceRadiusMiles() {
        return serviceRadiusMiles;
    }

    public void setServiceRadiusMiles(BigDecimal serviceRadiusMiles) {
        this.serviceRadiusMiles = serviceRadiusMiles;
    }

    public String getCapacityNotes() {
        return capacityNotes;
    }

    public void setCapacityNotes(String capacityNotes) {
        this.capacityNotes = capacityNotes;
    }

    public String getSnsTopicArn() {
        return snsTopicArn;
    }

    public void setSnsTopicArn(String snsTopicArn) {
        this.snsTopicArn = snsTopicArn;
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

    public List<AppUsers> getUsers() {
        return users;
    }

    public void setUsers(List<AppUsers> users) {
        this.users = users;
    }

    public List<FoodListings> getDonations() {
        return donations;
    }

    public void setDonations(List<FoodListings> donations) {
        this.donations = donations;
    }

    public List<PickupClaims> getReceivedClaims() {
        return receivedClaims;
    }

    public void setReceivedClaims(List<PickupClaims> receivedClaims) {
        this.receivedClaims = receivedClaims;
    }
}
