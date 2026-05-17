package com.app.models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "listing_tags", indexes = {
        @Index(name = "idx_listing_tags_tag", columnList = "tag")
})
@IdClass(ListingTagsId.class)
public class ListingTags {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private FoodListings listing;

    @Id
    @Column(name = "tag", nullable = false, length = 80)
    private String tag;

    @Column(name = "tag_type", nullable = false, length = 32)
    private String tagType = "DIETARY";

    public FoodListings getListing() {
        return listing;
    }

    public void setListing(FoodListings listing) {
        this.listing = listing;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getTagType() {
        return tagType;
    }

    public void setTagType(String tagType) {
        this.tagType = tagType;
    }
}
