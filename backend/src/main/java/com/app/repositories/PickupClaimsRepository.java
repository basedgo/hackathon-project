package com.app.repositories;

import com.app.models.PickupClaims;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PickupClaimsRepository extends JpaRepository<PickupClaims, UUID> {
}
