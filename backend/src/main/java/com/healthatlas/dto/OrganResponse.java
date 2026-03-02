package com.healthatlas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrganResponse {
    private Long id;
    private String name;
    private String displayName;
    private String category;
    private String description;
}
