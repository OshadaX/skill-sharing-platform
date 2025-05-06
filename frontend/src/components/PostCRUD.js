import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './PostCRUD.css';

const PostCRUD = () => {
  const [posts, setPosts] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [price, setPrice] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async () => {
    try {
      await axios.post('http://localhost:8080/api/posts', {
        courseName,
        imageUrl,
        videoUrl,
        description,
        deadline,
        price,
      });
      fetchPosts();
      clearForm();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const updatePost = async () => {
    try {
      await axios.put(`http://localhost:8080/api/posts/${selectedPostId}`, {
        courseName,
        imageUrl,
        videoUrl,
        description,
        deadline,
        price,
      });
      fetchPosts();
      clearForm();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleEdit = (post) => {
    setSelectedPostId(post.id);
    setCourseName(post.courseName);
    setImageUrl(post.imageUrl);
    setVideoUrl(post.videoUrl);
    setDescription(post.description);
    setDeadline(post.deadline);
    setPrice(post.price);
  };

  const clearForm = () => {
    setCourseName('');
    setImageUrl('');
    setVideoUrl('');
    setDescription('');
    setDeadline('');
    setPrice('');
    setSelectedPostId(null);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 4 }}>
      {/* Form Section - Left Side */}
      <Box
        sx={{
          width: '30%', // Adjusted to take 3/7 of the space
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          padding: 3,
        }}
      >
        <Typography variant="h5" className="post-management-title" gutterBottom>
          Course Post Management
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Name"
              variant="outlined"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="form-input"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Image URL"
              variant="outlined"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="form-input"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Video URL"
              variant="outlined"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="form-input"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              variant="outlined"
              className="form-input"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price (Rs.)"
              variant="outlined"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color={selectedPostId ? 'warning' : 'primary'}
                onClick={selectedPostId ? updatePost : createPost}
                className="form-button"
              >
                {selectedPostId ? 'Update Course' : 'Add New Course'}
              </Button>
              <Button
                variant="outlined"
                onClick={clearForm}
                className="form-button"
              >
                Clear Fields
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Posts Section - Right Side */}
      <Box
        sx={{
          width: '65%', // Adjusted to take 4/7 of the space
          overflowY: 'auto',
          maxHeight: '80vh',
          padding: 3,
        }}
      >
        <Grid container spacing={2}>
          {posts.slice(0, 2).map((post) => (
            <Grid item xs={12} sm={6} key={post.id}>
              <Card className="post-card">
                <CardContent>
                  <Typography variant="h6" className="post-title">
                    {post.courseName}
                  </Typography>
                  {post.imageUrl && <img src={post.imageUrl} alt="Post" className="post-image" />}
                  {post.videoUrl && (
                    <div className="video-container">
                      <iframe
                        src={post.videoUrl}
                        title="Video"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  <Typography className="post-description">
                    {post.description}
                  </Typography>
                  <span className="post-deadline">Deadline: {post.deadline}</span>
                  <span className="post-price">Price: Rs. {post.price}</span>
                </CardContent>
                <Box className="post-actions">
                  <IconButton onClick={() => handleEdit(post)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deletePost(post.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                  <Button component={Link} to={`/posts/${post.id}`} size="small" color="primary">
                    More Details
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default PostCRUD;
