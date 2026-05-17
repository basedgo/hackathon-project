package com.app.controllers;

import com.app.models.AuditEvents;
import com.app.services.AuditEventsServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/audit-events")
public class AuditEventsController {

    private final AuditEventsServices services;

    public AuditEventsController(AuditEventsServices services) {
        this.services = services;
    }

    @GetMapping
    public List<AuditEvents> list() {
        return services.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuditEvents> get(@PathVariable UUID id) {
        return services.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AuditEvents> create(@RequestBody AuditEvents auditEvents) {
        AuditEvents saved = services.create(auditEvents);
        return ResponseEntity.created(URI.create("/api/audit-events/" + saved.getAuditEventId())).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuditEvents> update(@PathVariable UUID id, @RequestBody AuditEvents auditEvents) {
        if (!services.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        AuditEvents saved = services.update(id, auditEvents);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        services.delete(id);
        return ResponseEntity.noContent().build();
    }
}
