package com.app.services;

import com.app.models.ListingTags;
import com.app.models.ListingTagsId;
import com.app.repositories.ListingTagsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ListingTagsService {

    private final ListingTagsRepository repository;

    public ListingTagsService(ListingTagsRepository repository) {
        this.repository = repository;
    }

    public List<ListingTags> findAll() {
        return repository.findAll();
    }

    public Optional<ListingTags> findById(ListingTagsId id) {
        return repository.findById(id);
    }

    public ListingTags create(ListingTags listingTags) {
        return repository.save(listingTags);
    }

    public ListingTags update(ListingTags listingTags) {
        return repository.save(listingTags);
    }

    public void delete(ListingTagsId id) {
        repository.deleteById(id);
    }
}
