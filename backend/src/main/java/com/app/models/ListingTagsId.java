package com.app.models;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class ListingTagsId implements Serializable {

    private UUID listing;
    private String tag;

    public ListingTagsId() {
    }

    public ListingTagsId(UUID listing, String tag) {
        this.listing = listing;
        this.tag = tag;
    }

    public UUID getListing() {
        return listing;
    }

    public void setListing(UUID listing) {
        this.listing = listing;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ListingTagsId)) return false;
        ListingTagsId that = (ListingTagsId) o;
        return Objects.equals(listing, that.listing) && Objects.equals(tag, that.tag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(listing, tag);
    }
}
