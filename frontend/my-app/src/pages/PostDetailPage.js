import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../api';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post');
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Post Detail Page</h1>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      {/* Display other post details here */}
    </div>
  );
}

export default PostDetailPage;
