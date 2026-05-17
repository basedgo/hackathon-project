package com.app.services;

import com.app.models.AuditEvents;
import com.app.repositories.AuditEventsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuditEventsServices {

    private final AuditEventsRepository repository;

    public AuditEventsServices(AuditEventsRepository repository) {
        this.repository = repository;
    }

    public List<AuditEvents> findAll() {
        return repository.findAll();
    }

    public Optional<AuditEvents> findById(UUID auditEventId) {
        return repository.findById(auditEventId);
    }

    public AuditEvents create(AuditEvents auditEvents) {
        return repository.save(auditEvents);
    }

    public AuditEvents update(UUID auditEventId, AuditEvents auditEvents) {
        auditEvents.setAuditEventId(auditEventId);
        return repository.save(auditEvents);
    }

    public void delete(UUID auditEventId) {
        repository.deleteById(auditEventId);
    }
}
