import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LearningPlanPage from './pages/LearningPlanPage';
import LearningPlanDetails from './components/LearningPlan/LearningPlanDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LearningPlanPage />} />
          <Route path="/details/:id" element={<LearningPlanDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;