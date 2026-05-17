package com.app.controllers;

import com.app.models.ListingAlertPreferences;
import com.app.services.ListingAlertPreferencesServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listing-alert-preferences")
public class ListingAlertPreferencesController {

    private final ListingAlertPreferencesServices services;

    public ListingAlertPreferencesController(ListingAlertPreferencesServices services) {
        this.services = services;
    }

    @GetMapping
    public List<ListingAlertPreferences> list() {
        return services.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingAlertPreferences> get(@PathVariable UUID id) {
        return services.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ListingAlertPreferences> create(@RequestBody ListingAlertPreferences listingAlertPreferences) {
        ListingAlertPreferences saved = services.create(listingAlertPreferences);
        return ResponseEntity.created(URI.create("/api/listing-alert-preferences/" + saved.getListingAlertPreferenceId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingAlertPreferences> update(@PathVariable UUID id, @RequestBody ListingAlertPreferences listingAlertPreferences) {
        if (!services.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        ListingAlertPreferences saved = services.update(id, listingAlertPreferences);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        services.delete(id);
        return ResponseEntity.noContent().build();
    }
}
