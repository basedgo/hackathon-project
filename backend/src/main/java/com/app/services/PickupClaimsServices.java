package com.app.services;

import com.app.models.PickupClaims;
import com.app.repositories.PickupClaimsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PickupClaimsServices {

    private final PickupClaimsRepository repository;

    public PickupClaimsServices(PickupClaimsRepository repository) {
        this.repository = repository;
    }

    public List<PickupClaims> findAll() {
        return repository.findAll();
    }

    public Optional<PickupClaims> findById(UUID claimId) {
        return repository.findById(claimId);
    }

    public PickupClaims create(PickupClaims pickupClaims) {
        return repository.save(pickupClaims);
    }

    public PickupClaims update(UUID claimId, PickupClaims pickupClaims) {
        pickupClaims.setClaimId(claimId);
        return repository.save(pickupClaims);
    }

    public void delete(UUID claimId) {
        repository.deleteById(claimId);
    }
}
