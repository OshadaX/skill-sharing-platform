import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Post from './pages/Post';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Post />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
