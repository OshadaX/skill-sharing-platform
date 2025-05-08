import React from 'react';
import { useNavigate } from 'react-router-dom';
import learningPlanService from '../../services/learningPlanService';
import { FiEdit, FiTrash2, FiInfo } from 'react-icons/fi';

const LearningPlanCard = ({ plan, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleDeleteClick = async () => {
    if (window.confirm(`Are you sure you want to delete ${plan.title}?`)) {
      try {
        await learningPlanService.remove(plan.id);
        onDelete();
      } catch (error) {
        console.error('Error deleting learning plan:', error);
      }
    }
  };

  return (
    <>
      <div className="learning-plan-card">
        <div className="card-header">
          <h3>{plan.title}</h3>
          <span className={`status-badge ${plan.status.toLowerCase()}`}>
            {plan.status}
          </span>
        </div>

        <div className="card-details">
          <div className="detail-item">
            <label>Target Skill</label>
            <p>{plan.targetSkill || 'N/A'}</p>
          </div>
        </div>

        <div className="card-actions">
          <button className="icon-btn" onClick={() => onEdit(plan)} aria-label="Edit">
            <FiEdit />
          </button>
          <button className="icon-btn danger" onClick={handleDeleteClick} aria-label="Delete">
            <FiTrash2 />
          </button>
          <button className="icon-btn info" onClick={() => navigate(`/details/${plan.id}`)} aria-label="More Info">
            <FiInfo />
          </button>
        </div>
      </div>

      {/* Internal CSS */}
      <style>{`
        .learning-plan-card {
          --primary: #7e57c2;
          --success: #22c55e;
          --warning: #f59e0b;
          --danger: #ef4444;
          --background: #ffffff;
          --text: #1e293b;
          --border: #e2e8f0;

          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 1.5rem;
          margin: 1rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
          cursor: pointer;
        }

        .learning-plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text);
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          text-transform: capitalize;
        }

        .status-badge.active {
          background: #ede9fe;
          color: #6b21a8;
        }

        .status-badge.paused {
          background: #fef3c7;
          color: #b45309;
        }

        .status-badge.completed {
          background: #dcfce7;
          color: #15803d;
        }

        .card-details {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item label {
          display: block;
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .detail-item p {
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text);
        }

        .card-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }

        .icon-btn {
          padding: 0.5rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: transparent;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-btn:hover {
          background: #f1f5f9;
          color: var(--primary);
          border-color: var(--primary);
        }

        .icon-btn.danger:hover {
          color: var(--danger);
          border-color: var(--danger);
        }

        .icon-btn.info:hover {
          color: var(--primary);
          border-color: var(--primary);
        }

        .icon-btn svg {
          width: 1.25rem;
          height: 1.25rem;
        }
      `}</style>
    </>
  );
};

export default LearningPlanCard;
