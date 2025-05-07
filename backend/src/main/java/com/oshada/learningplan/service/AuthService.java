package com.oshada.learningplan.service;

import com.oshada.learningplan.dto.request.SignupRequest;
import com.oshada.learningplan.model.User;

public interface AuthService {
    User createUser(SignupRequest signupRequest);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
} 