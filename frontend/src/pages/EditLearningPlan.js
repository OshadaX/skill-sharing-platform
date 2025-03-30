import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../OshadaCss/EditLearningPlan.css';

function EditLearningPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [learningPlan, setLearningPlan] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    category: 'professional',
    priority: 'medium',
    status: 'active'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/learning-plans/${id}`);
        setLearningPlan(response.data);
      } catch (error) {
        console.error('Error fetching learning plan:', error);
        setMessage({ text: 'Failed to load learning plan', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPlan();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    try {
      await axios.put(`http://localhost:8080/api/learning-plans/${id}`, learningPlan);
      setMessage({ 
        text: 'Learning plan updated successfully!', 
        type: 'success' 
      });
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error editing learning plan:', error);
      setMessage({ 
        text: 'Error updating learning plan', 
        type: 'error' 
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading learning plan...</p>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <h1>Edit Learning Plan</h1>
      </div>

      <div className="editor-card">
        <form onSubmit={handleEdit} className="editor-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Plan Title*</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={learningPlan.title}
                  onChange={handleChange}
                  placeholder="e.g. Advanced React Concepts"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={learningPlan.category}
                  onChange={handleChange}
                  required
                >
                  <option value="professional">Professional Development</option>
                  <option value="technical">Technical Skills</option>
                  <option value="language">Language Learning</option>
                  <option value="personal">Personal Growth</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description*</label>
              <textarea
                id="description"
                name="description"
                value={learningPlan.description}
                onChange={handleChange}
                placeholder="Describe the learning objectives, key topics, and expected outcomes"
                rows="5"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Timeline</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="startDate">Start Date*</label>
                <div className="date-input">
                  <i className="fas fa-calendar-alt"></i>
                  <input
                    id="startDate"
                    type="date"
                    name="startDate"
                    value={learningPlan.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date*</label>
                <div className="date-input">
                  <i className="fas fa-calendar-alt"></i>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={learningPlan.endDate}
                    onChange={handleChange}
                    required
                    min={learningPlan.startDate}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="assignedTo">Assigned To*</label>
                <div className="input-with-icon">
                  <i className="fas fa-user"></i>
                  <input
                    id="assignedTo"
                    type="text"
                    name="assignedTo"
                    value={learningPlan.assignedTo}
                    onChange={handleChange}
                    placeholder="Enter name or email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Priority*</label>
                <div className="priority-selector">
                  <button
                    type="button"
                    className={`priority-btn ${learningPlan.priority === 'low' ? 'active' : ''}`}
                    onClick={() => setLearningPlan({...learningPlan, priority: 'low'})}
                  >
                    Low
                  </button>
                  <button
                    type="button"
                    className={`priority-btn ${learningPlan.priority === 'medium' ? 'active' : ''}`}
                    onClick={() => setLearningPlan({...learningPlan, priority: 'medium'})}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    className={`priority-btn ${learningPlan.priority === 'high' ? 'active' : ''}`}
                    onClick={() => setLearningPlan({...learningPlan, priority: 'high'})}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status*</label>
              <select
                id="status"
                name="status"
                value={learningPlan.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>
            <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditLearningPlan;