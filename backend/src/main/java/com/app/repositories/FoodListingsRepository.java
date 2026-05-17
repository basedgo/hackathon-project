package com.app.repositories;

import com.app.models.FoodListings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface FoodListingsRepository extends JpaRepository<FoodListings, UUID> {
}
