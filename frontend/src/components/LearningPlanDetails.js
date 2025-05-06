import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function LearningPlanDetails() {
  const [plan, setPlan] = useState(null);
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

  if (!plan) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Learning Plan Details</h2>
      <h3>{plan.title}</h3>
      <p>{plan.description}</p>
      <p>Deadline: {plan.deadline}</p>
      <p>Completed: {plan.isCompleted ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default LearningPlanDetails;
