import React, { useState, useEffect } from 'react';
import learningPlanService from '../../services/learningPlanService';

const LearningPlanForm = ({ plan, onSubmit, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetSkill, setTargetSkill] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (plan) {
      setTitle(plan.title || '');
      setDescription(plan.description || '');
      setTargetSkill(plan.targetSkill || '');
      setStatus(plan.status || '');
      setStartDate(plan.startDate || '');
      setEndDate(plan.endDate || '');
      setAssignedTo(plan.assignedTo || '');
    } else {
      setTitle('');
      setDescription('');
      setTargetSkill('');
      setStatus('');
      setStartDate('');
      setEndDate('');
      setAssignedTo('');
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newLearningPlan = {
      title,
      description,
      targetSkill,
      status,
      startDate,
      endDate,
      assignedTo,
    };

    try {
      if (plan) {
        await learningPlanService.update(plan.id, newLearningPlan, targetSkill, status);
      } else {
        await learningPlanService.create(newLearningPlan, targetSkill, status);
      }
      onSubmit(newLearningPlan);
      onClose();
    } catch (error) {
      console.error('Error creating/updating learning plan:', error);
    }
  };

  return (
    <>
      <div className="modern-form-wrapper">
        <h3>{plan ? 'Edit Learning Plan' : 'Create Learning Plan'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <label>Target Skill</label>
          <input type="text" value={targetSkill} onChange={(e) => setTargetSkill(e.target.value)} required />

          <label>Status</label>
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />

          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <label>Assigned To</label>
          <input type="text" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />

          <div className="form-buttons">
            <button type="submit" className="btn primary">{plan ? 'Update' : 'Create'}</button>
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>

      <style>{`
        .modern-form-wrapper {
          max-width: 550px;
          margin: 2rem auto;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          animation: fadeIn 0.3s ease;
        }

        .modern-form-wrapper h3 {
          text-align: center;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
          color: #1e293b;
        }

        form {
          display: flex;
          flex-direction: column;
        }

        label {
          font-size: 0.95rem;
          font-weight: 500;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
          color: #475569;
        }

        input,
        textarea {
          padding: 0.75rem 1rem;
          font-size: 1rem;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          transition: all 0.3s ease;
          background: #f9fafb;
        }

        input:focus,
        textarea:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          outline: none;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s ease;
          border: none;
        }

        .btn.primary {
          background: #6366f1;
          color: white;
        }

        .btn.primary:hover {
          background: #4f46e5;
        }

        .btn.secondary {
          background: #e2e8f0;
          color: #1e293b;
        }

        .btn.secondary:hover {
          background: #cbd5e1;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .modern-form-wrapper {
            padding: 1.5rem 1rem;
          }

          .form-buttons {
            flex-direction: column;
            gap: 0.75rem;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default LearningPlanForm;
