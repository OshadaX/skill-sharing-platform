package com.oshada.learningplan.controller;

import com.oshada.learningplan.model.Post;
import com.oshada.learningplan.model.User;
import com.oshada.learningplan.repository.PostRepository;
import com.oshada.learningplan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post = postRepository.findById(id);
        return post.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            post.setAuthor(userOpt.get());
            Post savedPost = postRepository.save(post);
            return ResponseEntity.ok(savedPost);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        Optional<Post> existingPostOpt = postRepository.findById(id);
        if (existingPostOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Post existingPost = existingPostOpt.get();
        if (!existingPost.getAuthor().getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }
        
        existingPost.setTitle(postDetails.getTitle());
        existingPost.setDescription(postDetails.getDescription());
        existingPost.setTags(postDetails.getTags());
        
        Post updatedPost = postRepository.save(existingPost);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        
        return postRepository.findById(id)
                .map(post -> {
                    if (!post.getAuthor().getUsername().equals(username)) {
                        return ResponseEntity.status(403).build();
                    }
                    
                    postRepository.delete(post);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
