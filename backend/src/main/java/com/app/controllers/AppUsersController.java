package com.app.controllers;

import com.app.models.AppUsers;
import com.app.services.AppUsersServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/app-users")
public class AppUsersController {

    private final AppUsersServices services;

    public AppUsersController(AppUsersServices services) {
        this.services = services;
    }

    @GetMapping
    public List<AppUsers> list() {
        return services.findAll();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<AppUsers> get(@PathVariable UUID userId) {
        return services.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AppUsers> create(@RequestBody AppUsers appUsers) {
        AppUsers saved = services.create(appUsers);
        return ResponseEntity.created(URI.create("/api/app-users/" + saved.getUserId())).body(saved);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<AppUsers> update(@PathVariable UUID userId, @RequestBody AppUsers appUsers) {
        if (!services.findById(userId).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        AppUsers saved = services.update(userId, appUsers);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> delete(@PathVariable UUID userId) {
        services.delete(userId);
        return ResponseEntity.noContent().build();
    }
}
