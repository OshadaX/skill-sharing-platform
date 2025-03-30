import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../CSS/EditLearningPlan.css';

function EditLearningPlan() {
  const { id } = useParams();
  const [learningPlan, setLearningPlan] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedTo: ''
  });
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
      navigate('/');  // Navigate back to home
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
        <div>
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={learningPlan.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={learningPlan.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Assigned To</label>
          <input
            type="text"
            name="assignedTo"
            value={learningPlan.assignedTo}
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
