// src/components/LearningPlanDetails.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './LearningPlanDetails.css';
import { useParams } from 'react-router-dom';
import { ThreeDots } from 'react-loader-spinner';

function LearningPlanDetails() {
  const [plan, setPlan] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [goal, setGoal] = useState('');
  const [timeFrame, setTimeFrame] = useState('');
  const [resources, setResources] = useState('');
  const { id } = useParams();

  const fetchPlan = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/learningplans/${id}`);
      setPlan(response.data);
    } catch (error) {
      console.error('Error fetching plan:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (newUpdate.trim()) {
      setUpdates(prev => [...prev, { text: newUpdate, date: new Date().toLocaleDateString() }]);
      setNewUpdate('');
    }
  };

  const handleSavePlan = () => {
    console.log('Saving learning plan:', { goal, timeFrame, resources });
  };

  if (!plan) {
    return (
      <div className="loading-container">
        <ThreeDots color="#2d79c7" height={50} width={50} />
      </div>
    );
  }

  return (
    <div className="plan-container">
      <div className="plan-header">
        <h1 className="plan-title">{plan.title}</h1>
        <div className="plan-meta">
          <span className="meta-item">⏳ {plan.deadline}</span>
          <span className={`status-badge ${plan.isCompleted ? 'completed' : 'in-progress'}`}>
            {plan.isCompleted ? '✓ Completed' : '⌛ In Progress'}
          </span>
        </div>
      </div>

      <div className="content-card">
        <section>
          <h2>📋 Overview</h2>
          <p className="plan-description">{plan.description}</p>
        </section>

        <section className="progress-section">
          <h3>📈 Progress Updates</h3>
          <form onSubmit={handleUpdateSubmit} className="update-form">
            <input
              type="text"
              value={newUpdate}
              onChange={(e) => setNewUpdate(e.target.value)}
              placeholder="Share your progress today..."
              className="update-input"
            />
            <button type="submit" className="btn primary">Add</button>
          </form>
          <div className="updates-list">
            {updates.map((update, idx) => (
              <div key={idx} className="update-item">
                <span className="update-date">{update.date}</span>
                <p>{update.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="custom-section">
          <h3>⚙️ Customize Plan</h3>
          <div className="input-group">
            <label>🎯 Learning Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What do you want to achieve?"
            />
          </div>
          <div className="input-group">
            <label>⏱️ Time Frame</label>
            <input
              type="text"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              placeholder="e.g., 4 weeks"
            />
          </div>
          <div className="input-group">
            <label>📚 Resources</label>
            <input
              type="text"
              value={resources}
              onChange={(e) => setResources(e.target.value)}
              placeholder="Courses, books, websites..."
            />
          </div>
          <button onClick={handleSavePlan} className="btn success">Save Plan</button>
        </section>
      </div>
    </div>
  );
}

export default LearningPlanDetails;
