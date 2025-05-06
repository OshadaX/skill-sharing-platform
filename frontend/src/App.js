import React from 'react';
import LearningPlanCRUD from './components/LearningPlanCRUD';
import PostCRUD from './components/PostCRUD';
import PostDetails from './components/PostDetails';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LearningPlanDetails from './components/LearningPlanDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LearningPlanCRUD />} />
        <Route path="/learningplans/:id" element={<LearningPlanDetails />} />
        <Route path="/posts" element={<PostCRUD />} />
        <Route path="/posts/:id" element={<PostDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
