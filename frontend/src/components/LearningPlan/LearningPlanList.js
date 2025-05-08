import React, { useState, useEffect } from 'react';
import LearningPlanCard from './LearningPlanCard';
import LearningPlanForm from './LearningPlanForm';
import learningPlanService from '../../services/learningPlanService';

const LearningPlanList = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchLearningPlans();
  }, []);

  const fetchLearningPlans = async () => {
    try {
      const response = await learningPlanService.getAll();
      setLearningPlans(response.data);
    } catch (error) {
      console.error('Error fetching learning plans:', error);
    }
  };

  const handleCreateClick = () => {
    setSelectedPlan(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPlan(null);
    fetchLearningPlans();
  };

  const handleUpdate = async () => {
    fetchLearningPlans();
    setShowForm(false);
  };

  return (
    <>
      <div className="learning-plan-list-container">
        <div className="header-bar">
          <h2 className="page-title">Learning Plan List</h2>
          <button className="create-btn" onClick={handleCreateClick}>
            + Create New Plan
          </button>
        </div>

        <div className="plan-grid">
          {learningPlans.map((plan) => (
            <LearningPlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => {
                setSelectedPlan(plan);
                setShowForm(true);
              }}
              onDelete={fetchLearningPlans}
            />
          ))}
        </div>

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-box">
              <LearningPlanForm
                plan={selectedPlan}
                onSubmit={handleUpdate}
                onClose={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>

      {/* Internal CSS */}
      <style>{`
        .learning-plan-list-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: #f4f7fc;
        }

        .header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e4e7;
        }

        .page-title {
          font-size: 2rem;
          font-weight: bold;
          color: #333;
        }

        .create-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(90deg, rgba(96, 165, 250, 1) 0%, rgba(59, 130, 246, 1) 100%);
          color: white;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .create-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-box {
          background: #fff;
          border-radius: 12px;
          padding: 2rem;
          width: 90%;
          max-width: 650px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-height: 90vh;
          overflow-y: auto;
          animation: modalFadeIn 0.3s ease-in-out;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 600px) {
          .create-btn {
            width: 100%;
            font-size: 1.1rem;
          }

          .modal-box {
            padding: 1.25rem;
          }
        }
      `}</style>
    </>
  );
};

export default LearningPlanList;
