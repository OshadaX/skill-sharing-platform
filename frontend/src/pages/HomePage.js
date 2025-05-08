import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to SkillSharing Platform</h1>
      <p>Manage your learning plans and track your progress effectively.</p>
      <Link to="/learning-plans" className="btn primary-btn">Go to Learning Plans</Link>

      <style>{`
        .home-page {
          text-align: center;
          padding: 2rem;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        .home-page h1 {
          font-size: 2.5rem;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .home-page p {
          font-size: 1.25rem;
          color: #475569;
          margin-bottom: 2rem;
        }

        .primary-btn {
          padding: 0.75rem 1.5rem;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          text-decoration: none;
          transition: background-color 0.2s;
        }

        .primary-btn:hover {
          background-color: #388e3c;
        }
      `}</style>
    </div>
  );
};

export default HomePage;