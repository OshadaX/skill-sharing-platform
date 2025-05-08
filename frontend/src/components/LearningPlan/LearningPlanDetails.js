import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import learningPlanService from '../../services/learningPlanService';
import ProgressChart from './ProgressChart';
import { FiPlus, FiCalendar, FiUser, FiTarget } from 'react-icons/fi';
import './styles/LearningPlanDetails.css';

const LearningPlanDetails = () => {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        const response = await learningPlanService.getById(id);
        setPlan(response.data);
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error('Error fetching learning plan details:', error);
      }
    };

    fetchPlanDetails();
  }, [id]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    const updatedTasks = [...tasks, { description: newTask, completed: false }];
    setTasks(updatedTasks);
    setNewTask('');
    updateProgress(updatedTasks);
  };

  const handleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    updateProgress(updatedTasks);
  };

  const updateProgress = (updatedTasks) => {
    const completedTasks = updatedTasks.filter((task) => task.completed).length;
    const progress = updatedTasks.length > 0 
      ? Math.round((completedTasks / updatedTasks.length) * 100)
      : 0;
    setPlan((prevPlan) => ({ ...prevPlan, progress }));
  };

  if (!plan) {
    return <div className="loading-container">
      <div className="loading-spinner"></div>
    </div>;
  }

  return (
    <div className="plan-details-container">
      <div className="plan-header">
        <div className="header-content">
          <h1 className="plan-title">{plan.title}</h1>
          <span className={`status-pill ${plan.status.toLowerCase()}`}>
            {plan.status}
          </span>
        </div>
        <div className="progress-indicator">
          <ProgressChart progress={plan.progress} />
          <span className="progress-text">{plan.progress}% Complete</span>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <FiTarget className="detail-icon" />
          <div>
            <label>Target Skill</label>
            <p>{plan.targetSkill || 'Not specified'}</p>
          </div>
        </div>

        <div className="detail-card">
          <FiUser className="detail-icon" />
          <div>
            <label>Assigned To</label>
            <p>{plan.assignedTo || 'Unassigned'}</p>
          </div>
        </div>

        <div className="detail-card">
          <FiCalendar className="detail-icon" />
          <div>
            <label>Timeline</label>
            <p>{new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="description-section">
        <h3>Description</h3>
        <p className="description-text">{plan.description || 'No description provided'}</p>
      </div>

      <div className="tasks-section">
        <h3>Learning Tasks</h3>
        <div className="task-input-container">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add new task..."
            className="task-input"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask} className="add-task-btn">
            <FiPlus /> Add Task
          </button>
        </div>

        <div className="task-list">
          {tasks.map((task, index) => (
            <div key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <label className="task-checkbox">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskCompletion(index)}
                />
                <span className="checkmark"></span>
              </label>
              <span className="task-text">{task.description}</span>
            </div>
          ))}
          {tasks.length === 0 && <p className="no-tasks">No tasks added yet</p>}
        </div>
      </div>
    </div>
  );
};

export default LearningPlanDetails;