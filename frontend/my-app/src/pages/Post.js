import React, { useState, useEffect } from 'react';
import { getAllPosts, createPost, updatePost, deletePost } from '../api';
import PostForm from '../components/PostForm';
import './Post.css';

function Post() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState({});
  const [showShareMessage, setShowShareMessage] = useState(false);
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handleLike = (postId) => {
    setLikes(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleShare = async (postId) => {
    await navigator.clipboard.writeText(window.location.href + `#post-${postId}`);
    setShowShareMessage(true);
    setTimeout(() => setShowShareMessage(false), 2000);
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments(prev => ({
        ...prev,
        [selectedPostForComments]: [
          ...(prev[selectedPostForComments] || []),
          {
            id: Date.now(),
            text: newComment,
            timestamp: new Date().toISOString()
          }
        ]
      }));
      setNewComment("");
      setSelectedPostForComments(null); // Close the comment modal after submitting
    }
  };

  const handleCreatePost = () => {
    setEditPost(null);
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setShowModal(true);
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleSubmit = async (postData) => {
    try {
      if (editPost) {
        await updatePost(editPost.id, postData);
        setPosts(posts.map(post => (post.id === editPost.id ? { ...post, ...postData } : post)));
      } else {
        const newPost = await createPost(postData);
        setPosts([newPost, ...posts]);
      }
      setShowModal(false);
      setEditPost(null);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  return (
    <div className="post-page">
      <div className="header">
        <h2>Feed</h2>
        <button className="create-btn" onClick={handleCreatePost}>+ Create Post</button>
      </div>

      {showShareMessage && <div className="share-message">Link copied to clipboard!</div>}

      <div className="post-list">
        <div className="post-column">
          {posts.map((post, index) => (
            <div className="post-card" key={post.id}>
              {post.images && <img className="post-img" src={post.images} alt="post" />}
              <div className="post-body">
                <h3>{post.title}</h3>
                <p className="desc">{post.description.substring(0, 100)}...</p>
                <div className="actions">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`like-btn ${likes[post.id] ? 'liked' : ''}`}
                  >
                    ❤️
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="share-btn"
                  >
                    📤
                  </button>
                  <button 
                    onClick={() => setSelectedPostForComments(post.id)}
                    className="comment-btn"
                  >
                    💬 {comments[post.id]?.length || 0}
                  </button>
                </div>
                <div className="admin-actions">
                  <button onClick={() => handleEditPost(post)}>Edit</button>
                  <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment Modal */}
      {selectedPostForComments && (
        <div className="comment-modal">
          <div className="comment-modal-content">
            <h3>Comments</h3>
            <button 
              className="close-modal"
              onClick={() => setSelectedPostForComments(null)} // Close the modal
            >
              &times; {/* Close button */}
            </button>
            
            <div className="comments-list">
              {comments[selectedPostForComments]?.map(comment => (
                <div key={comment.id} className="comment">
                  <p>{comment.text}</p>
                  <small>{new Date(comment.timestamp).toLocaleString()}</small>
                </div>
              ))}
            </div>

            <div className="comment-input">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
              />
              <button onClick={handleCommentSubmit}>Post Comment</button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Post Form Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <PostForm post={editPost} onSubmit={handleSubmit} />
            <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
