package com.app.services;

import com.app.models.FoodListings;
import com.app.repositories.FoodListingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class FoodListingsServices {

    private final FoodListingsRepository repository;

    public FoodListingsServices(FoodListingsRepository repository) {
        this.repository = repository;
    }

    public List<FoodListings> findAll() {
        return repository.findAll();
    }

    public Optional<FoodListings> findById(UUID listingId) {
        return repository.findById(listingId);
    }

    public FoodListings create(FoodListings foodListings) {
        return repository.save(foodListings);
    }

    public FoodListings update(UUID listingId, FoodListings foodListings) {
        foodListings.setListingId(listingId);
        return repository.save(foodListings);
    }

    public void delete(UUID listingId) {
        repository.deleteById(listingId);
    }
}
