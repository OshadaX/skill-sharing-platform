import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [learningPlans, setLearningPlans] = useState([]);

  useEffect(() => {
    // Fetch learning plans from backend
    axios.get('http://localhost:8080/api/learning-plans')
      .then(response => {
        setLearningPlans(response.data);
      })
      .catch(error => {
        console.error('Error fetching learning plans:', error);
      });
  }, []);

  return (
    <div className="home">
      <h2>Learning Plans</h2>
      <Link to="/create" className="btn">Create New Learning Plan</Link>
      <div className="learning-plans-list">
        {learningPlans.map(plan => (
          <div key={plan.id} className="learning-plan-card">
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <Link to={`/learning-plan/${plan.id}`} className="btn">View</Link>
            <Link to={`/edit-learning-plan/${plan.id}`} className="btn">Edit</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
