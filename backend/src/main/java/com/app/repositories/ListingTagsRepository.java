package com.app.repositories;

import com.app.models.ListingTags;
import com.app.models.ListingTagsId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ListingTagsRepository extends JpaRepository<ListingTags, ListingTagsId> {
}
