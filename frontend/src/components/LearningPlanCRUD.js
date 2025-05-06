import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Button, Modal, TextField, Box, IconButton, LinearProgress,
  Chip, MenuItem, Select, Tooltip, FormControl, InputLabel
} from '@mui/material';
import { Delete, Add, Edit, PriorityHigh, LowPriority, BusinessCenter } from '@mui/icons-material';
import './LearningPlanCRUD.css';

const LearningPlanCRUD = () => {
  const [plans, setPlans] = useState([]);
  const [newPlan, setNewPlan] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium',
    tasks: [] 
  });
  const [taskInputs, setTaskInputs] = useState(['']);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const priorityStyles = {
    high: { color: '#d32f2f', bgcolor: '#ffebee', icon: <PriorityHigh fontSize="small" /> },
    medium: { color: '#ef6c00', bgcolor: '#fff3e0', icon: <BusinessCenter fontSize="small" /> },
    low: { color: '#2e7d32', bgcolor: '#e8f5e9', icon: <LowPriority fontSize="small" /> }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan({ ...newPlan, [name]: value });
  };

  const handleTaskInputChange = (index, value) => {
    const updatedTasks = [...taskInputs];
    updatedTasks[index] = value;
    setTaskInputs(updatedTasks);
  };

  const addTaskField = () => {
    setTaskInputs([...taskInputs, '']);
  };

  const savePlan = () => {
    const formattedTasks = taskInputs
      .filter(task => task.trim() !== '')
      .map(task => ({ description: task, isCompleted: false }));

    const planData = {
      ...newPlan,
      tasks: formattedTasks,
      id: editMode ? editingId : plans.length + 1,
      created: new Date().toISOString().split('T')[0]
    };

    if (editMode) {
      setPlans(plans.map(p => p.id === editingId ? planData : p));
    } else {
      setPlans([...plans, planData]);
    }

    setModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPlan({ title: '', description: '', priority: 'medium', tasks: [] });
    setTaskInputs(['']);
    setEditMode(false);
    setEditingId(null);
  };

  const deletePlan = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const toggleTask = (planId, taskIndex) => {
    const updatedPlans = plans.map(plan => {
      if (plan.id === planId) {
        const updatedTasks = [...plan.tasks];
        updatedTasks[taskIndex].isCompleted = !updatedTasks[taskIndex].isCompleted;
        return { ...plan, tasks: updatedTasks };
      }
      return plan;
    });
    setPlans(updatedPlans);
  };

  const calculateProgress = (tasks) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (plan) => {
    setEditMode(true);
    setEditingId(plan.id);
    setNewPlan({ title: plan.title, description: plan.description, priority: plan.priority });
    setTaskInputs(plan.tasks.map(t => t.description));
    setModalOpen(true);
  };

  const PriorityChip = ({ priority }) => (
    <Chip
      label={priority}
      size="small"
      variant="outlined"
      icon={priorityStyles[priority].icon}
      sx={{ 
        ml: 1,
        color: priorityStyles[priority].color,
        borderColor: priorityStyles[priority].color,
        bgcolor: priorityStyles[priority].bgcolor
      }}
    />
  );

  const PlanCard = ({ plan }) => (
    <Card className="plan-card" sx={{ position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="div">{plan.title}</Typography>
            <PriorityChip priority={plan.priority} />
          </Box>
          <Box>
            <Tooltip title="Edit plan">
              <IconButton onClick={() => openEditModal(plan)} size="small">
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete plan">
              <IconButton onClick={() => deletePlan(plan.id)} size="small">
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
          {plan.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          {plan.tasks.map((task, idx) => (
            <Box key={idx} className="task-item" sx={{ 
              display: 'flex', 
              alignItems: 'center',
              py: 0.5,
              '&:hover': { bgcolor: 'action.hover' }
            }}>
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => toggleTask(plan.id, idx)}
                className="task-checkbox"
              />
              <span className={task.isCompleted ? 'completed' : ''}>
                {task.description}
              </span>
            </Box>
          ))}
        </Box>

        <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <LinearProgress
            variant="determinate"
            value={calculateProgress(plan.tasks)}
            sx={{ 
              height: 8,
              borderRadius: 4,
              mb: 0.5,
              '.MuiLinearProgress-bar': { borderRadius: 4 }
            }}
          />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption" color="text.secondary">
              Created: {plan.created}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {calculateProgress(plan.tasks)}% Complete
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div className="container">
      <Box sx={{ 
        maxWidth: 1200, 
        mx: 'auto', 
        px: 3, 
        py: 4,
        backgroundColor: 'background.default'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Learning Path Manager
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={openCreateModal}
            sx={{ borderRadius: 3, px: 3 }}
          >
            New Plan
          </Button>
        </Box>

        <div className="card-grid">
          {plans.map(plan => <PlanCard key={plan.id} plan={plan} />)}
        </div>

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box className="modal-style" sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: { xs: '90%', sm: 600 },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}>
            <Typography variant="h6" mb={3}>
              {editMode ? 'Edit Learning Path' : 'Create New Learning Path'}
            </Typography>
            
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newPlan.title}
              onChange={handleInputChange}
              margin="normal"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={newPlan.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newPlan.priority}
                label="Priority"
                onChange={(e) => setNewPlan({...newPlan, priority: e.target.value})}
                variant="outlined"
              >
                <MenuItem value="high">High Priority</MenuItem>
                <MenuItem value="medium">Medium Priority</MenuItem>
                <MenuItem value="low">Low Priority</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                Learning Tasks
              </Typography>
              {taskInputs.map((task, index) => (
                <TextField
                  key={index}
                  fullWidth
                  value={task}
                  onChange={(e) => handleTaskInputChange(index, e.target.value)}
                  margin="dense"
                  placeholder={`Task ${index + 1}`}
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
              ))}
              <Button 
                onClick={addTaskField} 
                startIcon={<Add />}
                sx={{ mt: 1 }}
              >
                Add Task
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => setModalOpen(false)}
                sx={{ borderRadius: 3, px: 3 }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                onClick={savePlan}
                sx={{ borderRadius: 3, px: 3 }}
              >
                {editMode ? 'Save Changes' : 'Create Plan'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </div>
  );
};

export default LearningPlanCRUD;