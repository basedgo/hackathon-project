package com.app.services;

import com.app.models.AppUsers;
import com.app.repositories.AppUsersRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AppUsersServices {

    private final AppUsersRepository repository;

    public AppUsersServices(AppUsersRepository repository) {
        this.repository = repository;
    }

    public List<AppUsers> findAll() {
        return repository.findAll();
    }

    public Optional<AppUsers> findById(UUID userId) {
        return repository.findById(userId);
    }

    public AppUsers create(AppUsers appUsers) {
        return repository.save(appUsers);
    }

    public AppUsers update(UUID userId, AppUsers appUsers) {
        appUsers.setUserId(userId);
        return repository.save(appUsers);
    }

    public void delete(UUID userId) {
        repository.deleteById(userId);
    }
}
