import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ViewLearningPlan() {
  const { id } = useParams();
  const [learningPlan, setLearningPlan] = useState(null);

  useEffect(() => {
    // Fetch the details of a specific learning plan
    axios.get(`http://localhost:8080/api/learning-plans/${id}`)
      .then(response => {
        setLearningPlan(response.data);
      })
      .catch(error => {
        console.error('Error fetching learning plan:', error);
      });
  }, [id]);

  if (!learningPlan) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-learning-plan">
      <h2>{learningPlan.title}</h2>
      <p>{learningPlan.description}</p>
    </div>
  );
}

export default ViewLearningPlan;
