import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../OshadaCss/CreateLearningPlan.css';

const CreateLearningPlan = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: '',
    category: 'professional',
    priority: 'medium',
    status: 'PLANNED'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const newErrors = {};
    if (formData.title.length < 3) newErrors.title = 'Title must be at least 3 characters long';
    if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters long';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Assigned to is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('http://localhost:8080/api/learning-plans', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessage({ 
        text: `Learning plan "${data.title}" created successfully!`, 
        type: 'success' 
      });
      
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Creation error:', error);
      setMessage({ 
        text: error.message || 'Failed to create plan. Please check console for details.', 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <div className="form-icon">
            <i className="fas fa-book-open"></i>
          </div>
          <div>
            <h1>Create Learning Path</h1>
            <p>Design a structured roadmap for your learning journey</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="learning-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="title">Plan Title*</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. React Mastery Program"
                  className={errors.title ? 'error' : ''}
                  required
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the learning objectives, key topics, and expected outcomes"
                rows="5"
                className={errors.description ? 'error' : ''}
                required
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
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
                    value={formData.startDate}
                    onChange={handleChange}
                    className={errors.startDate ? 'error' : ''}
                    required
                  />
                </div>
                {errors.startDate && <span className="error-message">{errors.startDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date*</label>
                <div className="date-input">
                  <i className="fas fa-calendar-alt"></i>
                  <input
                    id="endDate"
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    className={errors.endDate ? 'error' : ''}
                    required
                  />
                </div>
                {errors.endDate && <span className="error-message">{errors.endDate}</span>}
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
                    value={formData.assignedTo}
                    onChange={handleChange}
                    placeholder="Enter name or email"
                    className={errors.assignedTo ? 'error' : ''}
                    required
                  />
                </div>
                {errors.assignedTo && <span className="error-message">{errors.assignedTo}</span>}
              </div>

              <div className="form-group">
                <label>Priority*</label>
                <div className="priority-selector">
                  <button
                    type="button"
                    className={`priority-btn ${formData.priority === 'low' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, priority: 'low'})}
                  >
                    Low
                  </button>
                  <button
                    type="button"
                    className={`priority-btn ${formData.priority === 'medium' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, priority: 'medium'})}
                  >
                    Medium
                  </button>
                  <button
                    type="button"
                    className={`priority-btn ${formData.priority === 'high' ? 'active' : ''}`}
                    onClick={() => setFormData({...formData, priority: 'high'})}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i> Create Plan
                </>
              )}
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
};

export default CreateLearningPlan;