package com.healthatlas.repository;

import com.healthatlas.model.Organ;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganRepository extends JpaRepository<Organ, Long> {
    
    Optional<Organ> findByName(String name);
}
