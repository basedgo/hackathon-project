package com.app.services;

import com.app.models.ListingAlertPreferences;
import com.app.repositories.ListingAlertPreferencesRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ListingAlertPreferencesServices {

    private final ListingAlertPreferencesRepository repository;

    public ListingAlertPreferencesServices(ListingAlertPreferencesRepository repository) {
        this.repository = repository;
    }

    public List<ListingAlertPreferences> findAll() {
        return repository.findAll();
    }

    public Optional<ListingAlertPreferences> findById(UUID id) {
        return repository.findById(id);
    }

    public ListingAlertPreferences create(ListingAlertPreferences listingAlertPreferences) {
        return repository.save(listingAlertPreferences);
    }

    public ListingAlertPreferences update(UUID id, ListingAlertPreferences listingAlertPreferences) {
        listingAlertPreferences.setListingAlertPreferenceId(id);
        return repository.save(listingAlertPreferences);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
