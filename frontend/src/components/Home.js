import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { FiUpload } from 'react-icons/fi';
import { Modal, Alert } from 'react-bootstrap';
import '../styles/Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editingPost, setEditingPost] = useState(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [newPost, setNewPost] = useState({
        content: '',
        media: [],
        mediaPreviews: []
    });

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, redirecting to login');
            navigate('/login');
            return;
        }
        fetchPosts();
    }, [navigate]);

    const fetchPosts = async () => {
        try {
            console.log('Fetching posts...');
            const token = localStorage.getItem('token');
            console.log('Token present:', !!token);
            
            const response = await axios.get('/posts');
            console.log('Posts response:', response.data);
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching posts:', err);
            if (err.response?.status === 401) {
                setError('Please log in to view posts');
                console.log('Unauthorized access - redirecting to login');
                navigate('/login');
            } else {
                setError('Failed to fetch posts. Please try again later.');
            }
            setLoading(false);
        }
    };

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
        const previews = validFiles.map(file => URL.createObjectURL(file));
        
        setNewPost(prev => ({
            ...prev,
            media: [...prev.media, ...validFiles],
            mediaPreviews: [...prev.mediaPreviews, ...previews]
        }));
    };

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

    const createPost = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to create a post');
            navigate('/login');
            return;
        }

        if (!newPost.content.trim() && newPost.media.length === 0) {
            setError('Post must contain content or media');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const formData = new FormData();
            formData.append('content', newPost.content);
            
            newPost.media.forEach((file, index) => {
                formData.append(`media`, file);
            });
            
            console.log('Creating post with token:', !!token);
            const response = await axios.post('/posts', formData);
            console.log('Post created:', response.data);
            
            setPosts([response.data, ...posts]);
            setNewPost({ content: '', media: [], mediaPreviews: [] });
            setSuccess('Post created successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error creating post:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to delete posts');
            navigate('/login');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            await axios.delete(`/posts/${postId}`);
            setPosts(posts.filter(post => post.id !== postId));
            setSuccess('Post deleted successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error deleting post:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                setError('Failed to delete post. Please try again.');
            }
        }
    };

    const handleEdit = (post) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to edit posts');
            navigate('/login');
            return;
        }

        setEditingPost({
            id: post.id,
            content: post.content,
            existingMedia: post.media,
            newMedia: [],
            newMediaPreviews: []
        });
    };

    const updatePost = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to update posts');
            navigate('/login');
            return;
        }

        if (!editingPost.content.trim() && editingPost.existingMedia.length === 0 && editingPost.newMedia.length === 0) {
            setError('Post must contain content or media');
            return;
        }
        
        setLoading(true);
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
            
            const response = await axios.put(`/posts/${editingPost.id}`, formData);
            setPosts(posts.map(post => post.id === response.data.id ? response.data : post));
            setEditingPost(null);
            setSuccess('Post updated successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Error updating post:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                setError(err.response?.data?.message || 'Failed to update post. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleLike = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to like posts');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post(`/posts/${postId}/like`);
            setPosts(posts.map(post => post.id === response.data.id ? response.data : post));
        } catch (err) {
            console.error('Error liking post:', err);
            if (err.response?.status === 401) {
                setError('Your session has expired. Please log in again.');
                navigate('/login');
            } else {
                setError('Failed to like post. Please try again.');
            }
        }
    };

    if (loading && posts.length === 0) {
        return <div className="loading">Loading posts...</div>;
    }

    return (
        <div className="home-container">
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
            <div className="create-post-card">
                <textarea
                    className="post-input"
                    placeholder="Share your skills or learning progress..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    rows={3}
                />
                
                {/* Media Previews */}
                <div className="media-previews">
                    {newPost.mediaPreviews.map((preview, index) => (
                        <div key={index} className="media-preview-container">
                            {preview.includes('blob:') && newPost.media[index].type.includes('video') ? (
                                <video className="media-preview" controls>
                                    <source src={preview} type={newPost.media[index].type} />
                                </video>
                            ) : (
                                <img 
                                    src={preview} 
                                    alt="Preview" 
                                    className="media-preview" 
                                    onClick={() => {
                                        setSelectedMedia(preview);
                                        setShowMediaModal(true);
                                    }}
                                />
                            )}
                            <button 
                                className="remove-media-button"
                                onClick={() => removeMedia(index)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
                
                {/* Post Actions */}
                <div className="post-actions">
                    <label className="upload-button">
                        <FiUpload className="upload-icon" />
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
                        className="post-button"
                        onClick={createPost}
                        disabled={loading || (!newPost.content.trim() && newPost.media.length === 0)}
                    >
                        {loading ? 'Posting...' : 'Post'}
                    </button>
                </div>
            </div>

            {/* Posts List */}
            <div className="posts-list">
                {posts.length === 0 ? (
                    <div className="no-posts">
                        <p>No posts yet. Be the first to share your skills!</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="post-card">
                            <div className="post-header">
                                <div className="user-info">
                                    <img 
                                        src={post.user.avatar || '/default-avatar.png'} 
                                        alt={post.user.name} 
                                        className="avatar"
                                    />
                                    <div>
                                        <h6>{post.user.name}</h6>
                                        <span className="post-time">
                                            {new Date(post.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                
                                {post.user.id === JSON.parse(localStorage.getItem('user'))?.id && (
                                    <div className="post-menu">
                                        <button 
                                            className="menu-button"
                                            onClick={() => handleEdit(post)}
                                        >
                                            <FaEllipsisH />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="post-content">
                                <p>{post.content}</p>
                            </div>
                            
                            {post.media.length > 0 && (
                                <div className="post-media">
                                    {post.media.map(media => (
                                        <div key={media.id} className="media-item">
                                            {media.type.includes('video') ? (
                                                <video 
                                                    className="embedded-media"
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
                                                    className="embedded-media"
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
                            
                            <div className="post-stats">
                                <span>{post.likes.length} likes</span>
                                <span>{post.comments.length} comments</span>
                            </div>
                            
                            <div className="post-actions">
                                <button 
                                    className="action-button"
                                    onClick={() => toggleLike(post.id)}
                                >
                                    {post.likes.some(like => like.user.id === JSON.parse(localStorage.getItem('user'))?.id) ? (
                                        <FaHeart className="liked" />
                                    ) : (
                                        <FaRegHeart />
                                    )}
                                    <span>Like</span>
                                </button>
                                
                                <button 
                                    className="action-button"
                                    onClick={() => navigate(`/post/${post.id}`)}
                                >
                                    <FaComment />
                                    <span>Comment</span>
                                </button>
                                
                                <button className="action-button">
                                    <FaShare />
                                    <span>Share</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Post Modal */}
            {editingPost && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <div className="modal-header">
                            <h5>Edit Post</h5>
                            <button 
                                className="close-button"
                                onClick={() => setEditingPost(null)}
                            >
                                <FaTimes />
                            </button>
                        </div>
                        
                        <textarea
                            className="post-input"
                            value={editingPost.content}
                            onChange={(e) => setEditingPost({
                                ...editingPost,
                                content: e.target.value
                            })}
                            rows={3}
                        />
                        
                        {/* Existing Media */}
                        <div className="media-previews">
                            {editingPost.existingMedia.map((media, index) => (
                                <div key={media.id} className="media-preview-container">
                                    {media.type.includes('video') ? (
                                        <video className="media-preview" controls>
                                            <source src={media.url} type={media.type} />
                                        </video>
                                    ) : (
                                        <img 
                                            src={media.url} 
                                            alt="Media" 
                                            className="media-preview"
                                        />
                                    )}
                                    <button 
                                        className="remove-media-button"
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
                        <div className="media-previews">
                            {editingPost.newMediaPreviews.map((preview, index) => (
                                <div key={index} className="media-preview-container">
                                    {preview.includes('blob:') && editingPost.newMedia[index].type.includes('video') ? (
                                        <video className="media-preview" controls>
                                            <source src={preview} type={editingPost.newMedia[index].type} />
                                        </video>
                                    ) : (
                                        <img 
                                            src={preview} 
                                            alt="Preview" 
                                            className="media-preview"
                                        />
                                    )}
                                    <button 
                                        className="remove-media-button"
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
                        
                        <div className="modal-actions">
                            <label className="upload-button">
                                <FiUpload className="upload-icon" />
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
                            
                            <div className="modal-buttons">
                                <button 
                                    className="cancel-button"
                                    onClick={() => setEditingPost(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="save-button"
                                    onClick={updatePost}
                                    disabled={loading || (!editingPost.content.trim() && 
                                        editingPost.existingMedia.length === 0 && 
                                        editingPost.newMedia.length === 0)}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
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
                <Modal.Body className="media-modal-body">
                    {selectedMedia && (
                        selectedMedia.includes('blob:') && newPost.media.find(m => 
                            URL.createObjectURL(m) === selectedMedia)?.type.includes('video') ? (
                            <video controls autoPlay className="full-media">
                                <source 
                                    src={selectedMedia} 
                                    type={newPost.media.find(m => 
                                        URL.createObjectURL(m) === selectedMedia)?.type} 
                                />
                            </video>
                        ) : (
                            <img src={selectedMedia} alt="Full size" className="full-media" />
                        )
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Home; 