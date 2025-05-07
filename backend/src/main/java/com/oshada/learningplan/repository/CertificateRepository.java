package com.oshada.learningplan.repository;

import com.oshada.learningplan.model.Certificate;
import com.oshada.learningplan.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Page<Certificate> findByUser(User user, Pageable pageable);
} 