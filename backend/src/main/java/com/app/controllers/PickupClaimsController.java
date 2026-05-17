package com.app.controllers;

import com.app.models.PickupClaims;
import com.app.services.PickupClaimsServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pickup-claims")
public class PickupClaimsController {

    private final PickupClaimsServices services;

    public PickupClaimsController(PickupClaimsServices services) {
        this.services = services;
    }

    @GetMapping
    public List<PickupClaims> list() {
        return services.findAll();
    }

    @GetMapping("/{claimId}")
    public ResponseEntity<PickupClaims> get(@PathVariable UUID claimId) {
        return services.findById(claimId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PickupClaims> create(@RequestBody PickupClaims pickupClaims) {
        PickupClaims saved = services.create(pickupClaims);
        return ResponseEntity.created(URI.create("/api/pickup-claims/" + saved.getClaimId())).body(saved);
    }

    @PutMapping("/{claimId}")
    public ResponseEntity<PickupClaims> update(@PathVariable UUID claimId, @RequestBody PickupClaims pickupClaims) {
        if (!services.findById(claimId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        PickupClaims saved = services.update(claimId, pickupClaims);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{claimId}")
    public ResponseEntity<Void> delete(@PathVariable UUID claimId) {
        services.delete(claimId);
        return ResponseEntity.noContent().build();
    }
}
