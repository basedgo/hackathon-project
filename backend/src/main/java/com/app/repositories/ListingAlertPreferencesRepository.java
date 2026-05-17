package com.app.repositories;

import com.app.models.ListingAlertPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ListingAlertPreferencesRepository extends JpaRepository<ListingAlertPreferences, UUID> {
}
