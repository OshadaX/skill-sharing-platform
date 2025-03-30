import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../OshadaCss/Home.css';

function Home() {
  const [learningPlans, setLearningPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredPlans = learningPlans.filter(plan => 
    plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Learning Paths</h1>
          <p>Design, track and optimize your learning journey</p>
        </div>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search plans..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link to="/create" className="create-btn">
            <i className="fas fa-plus"></i> New Plan
          </Link>
        </div>
      </header>

      <main className="dashboard-content">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your learning paths...</p>
          </div>
        ) : (
          <>
            <div className="stats-bar">
              <div className="stat-card">
                <h3>{learningPlans.length}</h3>
                <p>Total Plans</p>
              </div>
              <div className="stat-card">
                <h3>{learningPlans.filter(p => p.status === 'active').length}</h3>
                <p>Active</p>
              </div>
              <div className="stat-card">
                <h3>{learningPlans.filter(p => p.status === 'completed').length}</h3>
                <p>Completed</p>
              </div>
            </div>

            {filteredPlans.length > 0 ? (
              <div className="plans-container">
                {filteredPlans.map(plan => (
                  <div key={plan.id} className="plan-card">
                    <div className="card-top">
                      <div className="card-icon">
                        <i className={`fas ${plan.category === 'technical' ? 'fa-code' : 'fa-book-open'}`}></i>
                      </div>
                      <div className="card-header">
                        <h3>{plan.title}</h3>
                        <span className={`status-badge ${plan.status || 'active'}`}>
                          {plan.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    <div className="card-body">
                      <p>{plan.description || 'No description provided'}</p>
                      <div className="progress-container">
                        <div className="progress-bar" style={{ width: `${plan.progress || 0}%` }}></div>
                        <span>{plan.progress || 0}% Complete</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <Link to={`/learning-plan/${plan.id}`} className="action-btn view-btn">
                        <i className="fas fa-eye"></i>
                      </Link>
                      <Link to={`/edit-learning-plan/${plan.id}`} className="action-btn edit-btn">
                        <i className="fas fa-pen"></i>
                      </Link>
                      <button className="action-btn more-btn">
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-illustration">
                  <i className="fas fa-tasks"></i>
                </div>
                <h3>No Learning Paths Found</h3>
                <p>Create your first learning plan to get started</p>
                <Link to="/create" className="create-btn">
                  Create New Plan
                </Link>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Home;