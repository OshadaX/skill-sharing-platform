package com.oshada.learningplan.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String profilePicture;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 