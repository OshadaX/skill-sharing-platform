import React from 'react';
import LearningPlanList from '../components/LearningPlan/LearningPlanList';

const LearningPlanPage = () => {
  return (
    <>
      <div className="learning-plan-page">
        <h2 className="page-title">📘 Learning Plan Page</h2>
        <LearningPlanList />
      </div>

      <style>{`
        .learning-plan-page {
          padding: 2rem;
          background-color: #f9fafb;
          min-height: 100vh;
        }

        .page-title {
          font-size: 2rem;
          color: #1e293b;
          text-align: center;
          margin-bottom: 2rem;
        }

        @media (max-width: 600px) {
          .page-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default LearningPlanPage;
