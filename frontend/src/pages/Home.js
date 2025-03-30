import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../CSS/Home.css';

function Home() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/learning-plans')
      .then(response => {
        setLearningPlans(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching learning plans:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Learning Plans</h1>
        <p className="home-subtitle">Organize and track your learning journey</p>
      </header>
      
      <div className="home-actions">
        <Link to="/create" className="btn btn-primary">
          <i className="fas fa-plus"></i> Create New Plan
        </Link>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your learning plans...</p>
        </div>
      ) : (
        <div className="plans-grid">
          {learningPlans.length > 0 ? (
            learningPlans.map(plan => (
              <div key={plan.id} className="plan-card">
                <div className="card-header">
                  <h3>{plan.title}</h3>
                  <span className="card-badge">Active</span>
                </div>
                <div className="card-body">
                  <p>{plan.description || 'No description provided'}</p>
                </div>
                <div className="card-footer">
                  <Link to={`/learning-plan/${plan.id}`} className="btn btn-outline">
                    <i className="fas fa-eye"></i> View
                  </Link>
                  <Link to={`/edit-learning-plan/${plan.id}`} className="btn btn-outline">
                    <i className="fas fa-edit"></i> Edit
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fas fa-book-open empty-icon"></i>
              <h3>No Learning Plans Yet</h3>
              <p>Get started by creating your first learning plan</p>
              <Link to="/create" className="btn btn-primary">
                Create Plan
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;