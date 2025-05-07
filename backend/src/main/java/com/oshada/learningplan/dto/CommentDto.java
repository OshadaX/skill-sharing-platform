package com.oshada.learningplan.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id;
    private String content;
    private UserDto user;
    private Long postId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 