package com.app.controllers;

import com.app.models.FoodListings;
import com.app.models.ListingTags;
import com.app.models.ListingTagsId;
import com.app.services.ListingTagsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/listing-tags")
public class ListingTagsController {

    private final ListingTagsService services;

    public ListingTagsController(ListingTagsService services) {
        this.services = services;
    }

    @GetMapping
    public List<ListingTags> list() {
        return services.findAll();
    }

    @GetMapping("/{listingId}/{tag}")
    public ResponseEntity<ListingTags> get(@PathVariable UUID listingId, @PathVariable String tag) {
        ListingTagsId id = new ListingTagsId(listingId, tag);
        return services.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ListingTags> create(@RequestBody ListingTags listingTags) {
        ListingTags saved = services.create(listingTags);
        return ResponseEntity.created(URI.create("/api/listing-tags/" + saved.getListing().getListingId() + "/" + saved.getTag())).body(saved);
    }

    @PutMapping("/{listingId}/{tag}")
    public ResponseEntity<ListingTags> update(@PathVariable UUID listingId, @PathVariable String tag, @RequestBody ListingTags listingTags) {
        ListingTagsId id = new ListingTagsId(listingId, tag);
        return services.findById(id)
                .map(existing -> {
                    existing.setTagType(listingTags.getTagType());
                    ListingTags saved = services.update(existing);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{listingId}/{tag}")
    public ResponseEntity<Void> delete(@PathVariable UUID listingId, @PathVariable String tag) {
        ListingTagsId id = new ListingTagsId(listingId, tag);
        services.delete(id);
        return ResponseEntity.noContent().build();
    }
}
