package com.oshada.learningplan.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class CertificateDto {
    private Long id;
    private String title;
    private String description;
    private Set<String> images;
    private UserDto user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 