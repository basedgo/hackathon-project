package com.app.controllers;

import com.app.models.Organization;
import com.app.services.OrganizationServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationController {

    private final OrganizationServices services;

    public OrganizationController(OrganizationServices services) {
        this.services = services;
    }

    @GetMapping
    public List<Organization> list() {
        return services.findAll();
    }

    @GetMapping("/{organizationId}")
    public ResponseEntity<Organization> get(@PathVariable UUID organizationId) {
        return services.findById(organizationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Organization> create(@RequestBody Organization organization) {
        Organization saved = services.create(organization);
        return ResponseEntity.created(URI.create("/api/organizations/" + saved.getOrganizationId())).body(saved);
    }

    @PutMapping("/{organizationId}")
    public ResponseEntity<Organization> update(@PathVariable UUID organizationId, @RequestBody Organization organization) {
        if (!services.findById(organizationId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Organization saved = services.update(organizationId, organization);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{organizationId}")
    public ResponseEntity<Void> delete(@PathVariable UUID organizationId) {
        services.delete(organizationId);
        return ResponseEntity.noContent().build();
    }
}
