import React from 'react';
import LearningPlanCRUD from './components/LearningPlanCRUD';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LearningPlanDetails from './components/LearningPlanDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LearningPlanCRUD />} />
        <Route path="/learningplans/:id" element={<LearningPlanDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
