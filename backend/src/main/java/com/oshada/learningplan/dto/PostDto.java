package com.oshada.learningplan.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class PostDto {
    private Long id;
    private String title;
    private String description;
    private Set<String> images;
    private UserDto user;
    private int likesCount;
    private int commentsCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 