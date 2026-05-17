package com.app.repositories;

import com.app.models.AuditEvents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AuditEventsRepository extends JpaRepository<AuditEvents, UUID> {
}
