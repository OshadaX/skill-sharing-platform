// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import CreateLearningPlan from './pages/CreateLearningPlan';
import EditLearningPlan from './pages/EditLearningPlan';
import ViewLearningPlan from './pages/ViewLearningPlan';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateLearningPlan />} />
          <Route path="/edit-learning-plan/:id" element={<EditLearningPlan />} />
          <Route path="/learning-plan/:id" element={<ViewLearningPlan />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
