package com.oshada.learningplan.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String courseName;
    private String imageUrl;
    private String videoUrl;
    private String description;
    private LocalDate deadline = LocalDate.now();
    private Double price;

    // Constructors, getters, and setters
}
