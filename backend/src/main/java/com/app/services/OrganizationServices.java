package com.app.services;

import com.app.models.Organization;
import com.app.repositories.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class OrganizationServices {

    private final OrganizationRepository repository;

    public OrganizationServices(OrganizationRepository repository) {
        this.repository = repository;
    }

    public List<Organization> findAll() {
        return repository.findAll();
    }

    public Optional<Organization> findById(UUID organizationId) {
        return repository.findById(organizationId);
    }

    public Organization create(Organization organization) {
        return repository.save(organization);
    }

    public Organization update(UUID organizationId, Organization organization) {
        organization.setOrganizationId(organizationId);
        return repository.save(organization);
    }

    public void delete(UUID organizationId) {
        repository.deleteById(organizationId);
    }
}
