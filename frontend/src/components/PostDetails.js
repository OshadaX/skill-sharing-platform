import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  CardActions,
  Box,
  TextField,
  Button,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  LinearProgress,
  styled
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Share,
  Comment,
  Send,
  Bookmark,
  BookmarkBorder
} from '@mui/icons-material';
import { red, blue, teal } from '@mui/material/colors';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '24px',
  boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)'
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  margin: '16px 0',
}));

const PostDetails = () => {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(response.data);
        setLikes(response.data.likes || 0);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { 
        user: 'Current User', 
        text: newComment,
        timestamp: new Date().toLocaleString()
      }]);
      setNewComment('');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  if (!post) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <ProgressBar sx={{ width: '60%' }} />
    </Box>
  );

  return (
    <Box sx={{ 
      maxWidth: 1000, 
      mx: 'auto', 
      p: { xs: 2, md: 4 },
      bgcolor: 'background.default'
    }}>
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              fontSize: { xs: '1.8rem', md: '2.4rem' }
            }}>
              {post.courseName}
            </Typography>
            <Chip 
              label={`₹${post.price}`} 
              sx={{ 
                bgcolor: teal[50], 
                color: teal[700],
                fontSize: '1.1rem',
                px: 2,
                py: 1
              }}
            />
          </Box>

          {/* Two-Column Layout for Image and Video + Details */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: 4, 
            mb: 4 
          }}>
            {/* Left: Image */}
            {post.imageUrl && (
              <Box sx={{
                flex: 1,
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: 3,
                maxHeight: 400
              }}>
                <img 
                  src={post.imageUrl} 
                  alt="Post" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}

            {/* Right: Video and Description */}
            <Box sx={{ flex: 2 }}>
              {post.videoUrl && (
                <Box sx={{
                  position: 'relative',
                  paddingBottom: '56.25%', // 16:9
                  height: 0,
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: 2,
                  mb: 3
                }}>
                  <iframe
                    src={post.videoUrl}
                    title="Video"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none'
                    }}
                  />
                </Box>
              )}

              <Typography variant="body1" sx={{
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'text.secondary',
                mb: 3
              }}>
                {post.description}
              </Typography>

              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'action.hover',
                p: 2,
                borderRadius: 2
              }}>
                <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                  ⏳ Deadline: {post.deadline}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Chip 
                    label={`${Math.floor(Math.random() * 50) + 50}% Booked`} 
                    color="warning"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${Math.floor(Math.random() * 20) + 1} seats left`} 
                    color="error"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>

        <CardActions sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          px: { xs: 2, md: 4 },
          py: 2,
          bgcolor: 'background.paper'
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handleLike} sx={{ color: red[500] }}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
              <Typography sx={{ ml: 1 }}>{likes}</Typography>
            </IconButton>
            <IconButton>
              <Comment />
              <Typography sx={{ ml: 1 }}>{comments.length}</Typography>
            </IconButton>
            <IconButton onClick={handleShare} sx={{ color: blue[500] }}>
              <Share />
            </IconButton>
          </Box>
          <IconButton onClick={handleBookmark}>
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </CardActions>

        <Divider />

        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            mb: 3,
            color: 'text.primary'
          }}>
            Comments ({comments.length})
          </Typography>

          <Box component="form" onSubmit={handleCommentSubmit} sx={{ 
            display: 'flex', 
            gap: 2,
            mb: 4 
          }}>
            <Avatar sx={{ bgcolor: teal[500] }}>U</Avatar>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              endIcon={<Send />}
              sx={{
                borderRadius: 4,
                px: 4,
                textTransform: 'none'
              }}
            >
              Post
            </Button>
          </Box>

          <List sx={{ bgcolor: 'background.paper', borderRadius: 4 }}>
            {comments.map((comment, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: blue[500] }}>
                    {comment.user[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {comment.user}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary">
                        {comment.text}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        {comment.timestamp}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default PostDetails;
