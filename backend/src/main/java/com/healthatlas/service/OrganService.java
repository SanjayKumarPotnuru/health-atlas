package com.healthatlas.service;

import com.healthatlas.dto.OrganResponse;
import com.healthatlas.model.Organ;
import com.healthatlas.repository.OrganRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganService {

    private final OrganRepository organRepository;

    public List<OrganResponse> getAllOrgans() {
        List<Organ> organs = organRepository.findAll();
        return organs.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private OrganResponse mapToDTO(Organ organ) {
        OrganResponse dto = new OrganResponse();
        dto.setId(organ.getId());
        dto.setName(organ.getName());
        dto.setDisplayName(organ.getDisplayName());
        dto.setCategory(organ.getCategory());
        dto.setDescription(organ.getDescription());
        return dto;
    }
}
