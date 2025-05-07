package com.oshada.learningplan.repository;

import com.oshada.learningplan.model.Post;
import com.oshada.learningplan.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUser(User user, Pageable pageable);
    Page<Post> findByUserIn(Iterable<User> users, Pageable pageable);
}
