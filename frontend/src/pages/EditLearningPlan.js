// src/pages/EditLearningPlan.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditLearningPlan() {
  const { id } = useParams();
  const [learningPlan, setLearningPlan] = useState({ title: '', description: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/learning-plans/${id}`)
      .then(response => {
        setLearningPlan(response.data);
      })
      .catch(error => {
        console.error('Error fetching learning plan:', error);
      });
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedPlan = { ...learningPlan };
      await axios.put(`http://localhost:8080/api/learning-plans/${id}`, updatedPlan);
      navigate('/');  // Use navigate instead of history.push
    } catch (error) {
      console.error('Error editing learning plan:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="edit-learning-plan">
      <h2>Edit Learning Plan</h2>
      <form onSubmit={handleEdit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={learningPlan.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={learningPlan.description}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Learning Plan</button>
      </form>
    </div>
  );
}

export default EditLearningPlan;
