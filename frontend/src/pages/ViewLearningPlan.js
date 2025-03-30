import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../OshadaCss/ViewLearningPlan.css';

function ViewLearningPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/learning-plans/${id}`);
        setLearningPlan(response.data);
      } catch (err) {
        console.error('Error fetching learning plan:', err);
        setError('Failed to load learning plan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPlan();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading your learning plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <i className="fas fa-exclamation-triangle"></i>
        <h3>{error}</h3>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="plan-viewer-container">
      <div className="plan-viewer-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="header-actions">
          <Link to={`/edit-learning-plan/${id}`} className="edit-button">
            <i className="fas fa-edit"></i> Edit
          </Link>
        </div>
      </div>

      <div className="plan-viewer-card">
        <div className="plan-header">
          <div className="plan-icon">
            <i className={`fas ${learningPlan.category === 'technical' ? 'fa-code' : 'fa-book-open'}`}></i>
          </div>
          <div className="plan-title-section">
            <h1>{learningPlan.title}</h1>
            <div className="plan-meta">
              <span className={`status-badge ${learningPlan.status || 'active'}`}>
                {learningPlan.status || 'Active'}
              </span>
              <span className="plan-dates">
                {new Date(learningPlan.startDate).toLocaleDateString()} - {new Date(learningPlan.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="plan-content">
          <section className="plan-section">
            <h2>Description</h2>
            <p>{learningPlan.description || 'No description provided'}</p>
          </section>

          <div className="plan-details-grid">
            <section className="plan-section">
              <h2>Details</h2>
              <div className="detail-item">
                <span className="detail-label">Assigned To:</span>
                <span className="detail-value">{learningPlan.assignedTo || 'Not assigned'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority:</span>
                <span className={`priority-tag ${learningPlan.priority || 'medium'}`}>
                  {learningPlan.priority || 'Medium'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">{learningPlan.category || 'General'}</span>
              </div>
            </section>

            <section className="plan-section">
              <h2>Progress</h2>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${learningPlan.progress || 0}%` }}></div>
                <span className="progress-text">{learningPlan.progress || 0}% Complete</span>
              </div>
              <div className="progress-actions">
                <button className="progress-btn">
                  <i className="fas fa-check"></i> Mark Complete
                </button>
                <button className="progress-btn">
                  <i className="fas fa-tasks"></i> Update Progress
                </button>
              </div>
            </section>
          </div>

          <section className="plan-section">
            <div className="section-header">
              <h2>Resources</h2>
              <button className="add-resource-btn">
                <i className="fas fa-plus"></i> Add Resource
              </button>
            </div>
            <div className="resources-list">
              {learningPlan.resources && learningPlan.resources.length > 0 ? (
                learningPlan.resources.map((resource, index) => (
                  <div key={index} className="resource-item">
                    <i className="fas fa-link"></i>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      {resource.name || 'Resource Link'}
                    </a>
                  </div>
                ))
              ) : (
                <p className="empty-resources">No resources added yet</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ViewLearningPlan;