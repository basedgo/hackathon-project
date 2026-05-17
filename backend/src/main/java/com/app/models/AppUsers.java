package com.app.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "app_users", indexes = {
        @Index(name = "idx_app_users_organization", columnList = "organization_id"),
        @Index(name = "idx_app_users_role", columnList = "role")
})
public class AppUsers {

    @Id
    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    @JsonIgnore
    private Organization organization;

    @Column(name = "full_name", nullable = false, length = 160)
    private String fullName;

    @Column(name = "display_initials", length = 8)
    private String displayInitials;

    @Column(name = "role", nullable = false, length = 32)
    private String role;

    @Column(name = "email", length = 255, unique = true)
    private String email;

    @Column(name = "phone", length = 40)
    private String phone;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "createdByUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FoodListings> createdListings = new ArrayList<>();

    @OneToMany(mappedBy = "volunteerUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<PickupClaims> volunteerClaims = new ArrayList<>();

    @PrePersist
    protected void prePersist() {
        if (userId == null) {
            userId = UUID.randomUUID();
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

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getDisplayInitials() {
        return displayInitials;
    }

    public void setDisplayInitials(String displayInitials) {
        this.displayInitials = displayInitials;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public List<FoodListings> getCreatedListings() {
        return createdListings;
    }

    public void setCreatedListings(List<FoodListings> createdListings) {
        this.createdListings = createdListings;
    }

    public List<PickupClaims> getVolunteerClaims() {
        return volunteerClaims;
    }

    public void setVolunteerClaims(List<PickupClaims> volunteerClaims) {
        this.volunteerClaims = volunteerClaims;
    }
}
