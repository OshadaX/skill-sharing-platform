import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PostManager.module.css';
import { Modal, Alert } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';

const PostManagement = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({ 
        content: '', 
        media: [], 
        mediaPreviews: [] 
    });
    const [editingPost, setEditingPost] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const navigate = useNavigate();

    // Fetch posts from API
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/posts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchPosts();
    }, []);

    // Handle media file selection
    const handleMediaChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length > 3) {
            setError('You can upload a maximum of 3 files');
            return;
        }
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
            const isImageOrVideo = validTypes.includes(file.type);
            const isWithinSizeLimit = file.size <= (file.type.includes('video') ? 30 * 1024 * 1024 : 5 * 1024 * 1024);
            
            if (!isImageOrVideo) {
                setError('Only images (JPEG, PNG, GIF) and videos (MP4) are allowed');
                return false;
            }
            
            if (!isWithinSizeLimit) {
                setError(file.type.includes('video') 
                    ? 'Videos must be under 30MB' 
                    : 'Images must be under 5MB');
                return false;
            }
            
            return true;
        });
        
        if (validFiles.length === 0) return;
        
        // Create previews for selected files
        const previews = validFiles.map(file => {
            return file.type.includes('video') 
                ? URL.createObjectURL(file) 
                : URL.createObjectURL(file);
        });
        
        setNewPost(prev => ({
            ...prev,
            media: [...prev.media, ...validFiles],
            mediaPreviews: [...prev.mediaPreviews, ...previews]
        }));
    };

    // Remove a media file from selection
    const removeMedia = (index) => {
        const updatedMedia = [...newPost.media];
        const updatedPreviews = [...newPost.mediaPreviews];
        
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedMedia.splice(index, 1);
        updatedPreviews.splice(index, 1);
        
        setNewPost({
            ...newPost,
            media: updatedMedia,
            mediaPreviews: updatedPreviews
        });
    };

    // Create a new post
    const createPost = async () => {
        if (!newPost.content.trim() && newPost.media.length === 0) {
            setError('Post must contain content or media');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('content', newPost.content);
            
            newPost.media.forEach((file, index) => {
                formData.append(`media`, file);
            });
            
            const response = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to create post');
            }
            
            const createdPost = await response.json();
            setPosts([createdPost, ...posts]);
            setNewPost({ content: '', media: [], mediaPreviews: [] });
            setSuccess('Post created successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Update an existing post
    const updatePost = async () => {
        if (!editingPost.content.trim() && editingPost.media.length === 0) {
            setError('Post must contain content or media');
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('content', editingPost.content);
            
            // Add existing media IDs that haven't changed
            editingPost.existingMedia.forEach(media => {
                formData.append('existingMediaIds', media.id);
            });
            
            // Add new media files
            editingPost.newMedia.forEach(file => {
                formData.append('media', file);
            });
            
            const response = await fetch(`http://localhost:8080/api/posts/${editingPost.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Failed to update post');
            }
            
            const updatedPost = await response.json();
            setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
            setEditingPost(null);
            setSuccess('Post updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Like/unlike a post
    const toggleLike = async (postId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }
            
            const updatedPost = await response.json();
            setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
        } catch (err) {
            setError(err.message);
        }
    };

    // Start editing a post
    const startEditing = (post) => {
        setEditingPost({
            id: post.id,
            content: post.content,
            existingMedia: post.media,
            newMedia: [],
            newMediaPreviews: []
        });
    };

    return (
        <div className={styles.container}>
            {/* Error/Success Messages */}
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}
            
            {success && (
                <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
                    {success}
                </Alert>
            )}
            
            {/* Create Post Section */}
            <div className={styles.createPostCard}>
                <textarea
                    className={styles.postInput}
                    placeholder="Share your skills or learning progress..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={3}
                />
                
                {/* Media Previews */}
                <div className={styles.mediaPreviews}>
                    {newPost.mediaPreviews.map((preview, index) => (
                        <div key={index} className={styles.mediaPreviewContainer}>
                            {preview.includes('blob:') && newPost.media[index].type.includes('video') ? (
                                <video className={styles.mediaPreview} controls>
                                    <source src={preview} type={newPost.media[index].type} />
                                </video>
                            ) : (
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className={styles.mediaPreview} 
                                    onClick={() => {
                                        setSelectedMedia(preview);
                                        setShowMediaModal(true);
                                    }}
                                />
                            )}
                            <button 
                                className={styles.removeMediaButton}
                                onClick={() => removeMedia(index)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
                
                {/* Post Actions */}
                <div className={styles.postActions}>
                    <label className={styles.uploadButton}>
                        <FiUpload className={styles.uploadIcon} />
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/mp4"
                            onChange={handleMediaChange}
                            style={{ display: 'none' }}
                        />
                        Media ({newPost.media.length}/3)
                    </label>
                    
                    <button 
                        className={styles.postButton}
                        onClick={createPost}
                        disabled={isLoading || (!newPost.content.trim() && newPost.media.length === 0)}
                    >
                        {isLoading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>
            
            {/* Edit Post Modal */}
            {editingPost && (
                <div className={styles.modalOverlay}>
                    <div className={styles.editModal}>
                        <div className={styles.modalHeader}>
                            <h5>Edit Post</h5>
                            <button 
                                className={styles.closeButton}
                                onClick={() => setEditingPost(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <textarea
                            className={styles.postInput}
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({
                                ...editingPost,
                                content: e.target.value
                            })}
                            rows={3}
                        />
                        
                        {/* Existing Media */}
                        <div className={styles.mediaPreviews}>
                            {editingPost.existingMedia.map((media, index) => (
                                <div key={media.id} className={styles.mediaPreviewContainer}>
                                    {media.type.includes('video') ? (
                                        <video className={styles.mediaPreview} controls>
                                            <source src={media.url} type={media.type} />
                                        </video>
                                    ) : (
                                        <img 
                                            src={media.url} 
                                            alt="Media" 
                                            className={styles.mediaPreview}
                                        />
                                    )}
                                    <button 
                                        className={styles.removeMediaButton}
                                        onClick={() => {
                                            const updatedMedia = [...editingPost.existingMedia];
                                            updatedMedia.splice(index, 1);
                                            setEditingPost({
                                                ...editingPost,
                                                existingMedia: updatedMedia
                                            });
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* New Media Uploads */}
                        <div className={styles.mediaPreviews}>
                            {editingPost.newMediaPreviews.map((preview, index) => (
                                <div key={index} className={styles.mediaPreviewContainer}>
                                    {preview.includes('blob:') && editingPost.newMedia[index].type.includes('video') ? (
                                        <video className={styles.mediaPreview} controls>
                                            <source src={preview} type={editingPost.newMedia[index].type} />
                                        </video>
                                    ) : (
                                        <img 
                                            src={preview} 
                                            alt="Preview" 
                                            className={styles.mediaPreview}
                                        />
                                    )}
                                    <button 
                                        className={styles.removeMediaButton}
                                        onClick={() => {
                                            const updatedMedia = [...editingPost.newMedia];
                                            const updatedPreviews = [...editingPost.newMediaPreviews];
                                            updatedMedia.splice(index, 1);
                                            updatedPreviews.splice(index, 1);
                                            setEditingPost({
                                                ...editingPost,
                                                newMedia: updatedMedia,
                                                newMediaPreviews: updatedPreviews
                                            });
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <div className={styles.modalActions}>
                            <label className={styles.uploadButton}>
                                <FiUpload className={styles.uploadIcon} />
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/mp4"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        const previews = files.map(file => URL.createObjectURL(file));
                                        setEditingPost({
                                            ...editingPost,
                                            newMedia: [...editingPost.newMedia, ...files],
                                            newMediaPreviews: [...editingPost.newMediaPreviews, ...previews]
                                        });
                                    }}
                                    style={{ display: 'none' }}
                                />
                                Add Media
                            </label>
                            
                            <div className={styles.modalButtons}>
                                <button 
                                    className={styles.cancelButton}
                                    onClick={() => setEditingPost(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={styles.saveButton}
                                    onClick={updatePost}
                                    disabled={isLoading || (!editingPost.content.trim() && 
                                        editingPost.existingMedia.length === 0 && 
                                        editingPost.newMedia.length === 0)}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Media Modal */}
            <Modal 
                show={showMediaModal} 
                onHide={() => setShowMediaModal(false)}
                centered
                size="lg"
            >
                <Modal.Body className={styles.mediaModalBody}>
                    {selectedMedia && (
                        selectedMedia.includes('blob:') && newPost.media.find(m => 
                            URL.createObjectURL(m) === selectedMedia)?.type.includes('video') ? (
                            <video controls autoPlay className={styles.fullMedia}>
                                <source 
                                    src={selectedMedia} 
                                    type={newPost.media.find(m => 
                                        URL.createObjectURL(m) === selectedMedia)?.type} 
                                />
                            </video>
                        ) : (
                            <img src={selectedMedia} alt="Full size" className={styles.fullMedia} />
                        )
                    )}
                </Modal.Body>
            </Modal>
            
            {/* Posts List */}
            <div className={styles.postsList}>
                {isLoading && posts.length === 0 ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading posts...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className={styles.noPosts}>
                        <p>No posts yet. Be the first to share your skills!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className={styles.postCard}>
                            <div className={styles.postHeader}>
                                <div 
                                    className={styles.userInfo}
                                    onClick={() => navigate(`/profile/${post.user.id}`)}
                                >
                                    <img 
                                        src={post.user.avatar || '/default-avatar.png'} 
                                        alt={post.user.name} 
                                        className={styles.avatar}
                                    />
                                    <div>
                                        <h6>{post.user.name}</h6>
                                        <span className={styles.postTime}>
                                            {new Date(post.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                
                                {post.user.id === localStorage.getItem('userId') && (
                                    <div className={styles.postMenu}>
                                        <button 
                                            className={styles.menuButton}
                                            onClick={() => startEditing(post)}
                                        >
                                            <FaEllipsisH />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className={styles.postContent}>
                                <p>{post.content}</p>
                            </div>
                            
                            {post.media.length > 0 && (
                                <div className={styles.postMedia}>
                                    {post.media.map(media => (
                                        <div key={media.id} className={styles.mediaItem}>
                                            {media.type.includes('video') ? (
                                                <video 
                                                    className={styles.embeddedMedia}
                                                    controls
                                                    onClick={() => {
                                                        setSelectedMedia(media.url);
                                                        setShowMediaModal(true);
                                                    }}
                                                >
                                                    <source src={media.url} type={media.type} />
                                                </video>
                                            ) : (
                                                <img 
                                                    src={media.url} 
                                                    alt="Post media" 
                                                    className={styles.embeddedMedia}
                                                    onClick={() => {
                                                        setSelectedMedia(media.url);
                                                        setShowMediaModal(true);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <div className={styles.postStats}>
                                <span>{post.likes.length} likes</span>
                                <span>{post.comments.length} comments</span>
                            </div>
                            
                            <div className={styles.postActions}>
                                <button 
                                    className={styles.actionButton}
                                    onClick={() => toggleLike(post.id)}
                                >
                                    {post.likes.some(like => like.user.id === localStorage.getItem('userId')) ? (
                                        <FaHeart className={styles.liked} />
                                    ) : (
                                        <FaRegHeart />
                                    )}
                                    <span>Like</span>
                                </button>
                                
                                <button 
                                    className={styles.actionButton}
                                    onClick={() => navigate(`/post/${post.id}`)}
                                >
                                    <FaComment />
                                    <span>Comment</span>
                                </button>
                                
                                <button className={styles.actionButton}>
                                    <FaShare />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PostManagement;
