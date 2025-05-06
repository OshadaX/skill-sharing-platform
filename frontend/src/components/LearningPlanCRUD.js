import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, Button, List, ListItem, ListItemText,
  ListItemSecondaryAction, IconButton, Paper, Checkbox, Divider,
  Grid, LinearProgress, Box, Avatar
} from '@mui/material';
import { Delete, Edit, Save, Add, Assignment, CalendarToday, Task } from '@mui/icons-material';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';  // Import Link for navigation
import './LearningPlanCRUD.css';

function LearningPlanCRUD() {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: format(new Date(), 'yyyy-MM-dd'),
    tasks: [{ description: '', isCompleted: false }]
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('http://localhost:8080/learningplans');
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskChange = (index, field, value) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks[index][field] = value;
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const addTask = () => {
    setFormData({ ...formData, tasks: [...formData.tasks, { description: '', isCompleted: false }] });
  };

  const removeTask = (index) => {
    const updatedTasks = [...formData.tasks];
    updatedTasks.splice(index, 1);
    setFormData({ ...formData, tasks: updatedTasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:8080/learningplans/${editingId}`
      : 'http://localhost:8080/learningplans';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      await response.json();
      fetchPlans();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await fetch(`http://localhost:8080/learningplans/${id}`, {
        method: 'DELETE'
      });
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const editPlan = (plan) => {
    setFormData({
      title: plan.title,
      description: plan.description,
      deadline: plan.deadline,
      tasks: plan.tasks || [{ description: '', isCompleted: false }]
    });
    setEditingId(plan.id);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      deadline: format(new Date(), 'yyyy-MM-dd'),
      tasks: [{ description: '', isCompleted: false }]
    });
    setEditingId(null);
  };

  const calculateProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return (completed / tasks.length) * 100;
  };

  return (
    <Container maxWidth="md" className="container">
      <Box className="header-box">
        <Avatar className="avatar"><Assignment /></Avatar>
        <Typography variant="h3" className="main-title">Learning Plan Manager</Typography>
        <Typography variant="subtitle1" className="subtitle">Organize, track, and achieve your learning goals</Typography>
      </Box>

      <Paper className="form-paper">
        <Typography variant="h5" className="form-title">
          {editingId ? <Edit fontSize="small" /> : <Add fontSize="small" />}
          {editingId ? 'Edit Learning Plan' : 'Create New Plan'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Plan Title" name="title" value={formData.title}
                onChange={handleInputChange} variant="outlined" className="rounded-input"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth label="Deadline" type="date" name="deadline"
                value={formData.deadline} onChange={handleInputChange}
                InputLabelProps={{ shrink: true }} className="rounded-input"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Description" name="description"
                value={formData.description} onChange={handleInputChange}
                multiline rows={3} variant="outlined" className="rounded-input"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" className="task-title"><Task fontSize="small" /> Tasks</Typography>
              {formData.tasks.map((task, index) => (
                <Box key={index} className="task-box">
                  <Checkbox checked={task.isCompleted} onChange={(e) => handleTaskChange(index, 'isCompleted', e.target.checked)} color="primary" />
                  <TextField
                    fullWidth value={task.description}
                    onChange={(e) => handleTaskChange(index, 'description', e.target.value)}
                    placeholder="Task description" variant="standard" className="task-input"
                    InputProps={{ disableUnderline: true }}
                  />
                  <IconButton onClick={() => removeTask(index)} color="error"><Delete /></IconButton>
                </Box>
              ))}
              <Button startIcon={<Add />} onClick={addTask} variant="text" color="primary" className="add-task-btn">
                Add Task
              </Button>
            </Grid>
            <Grid item xs={12} className="form-actions">
              {editingId && (
                <Button onClick={resetForm} variant="outlined" className="btn-cancel">Cancel</Button>
              )}
              <Button type="submit" variant="contained" startIcon={<Save />} className="btn-submit">
                {editingId ? 'Update Plan' : 'Create Plan'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Box>
        <Typography variant="h5" className="section-title"><Assignment fontSize="small" /> Your Learning Plans</Typography>
        {plans.length === 0 ? (
          <Paper className="empty-state">
            <Typography variant="body1" className="empty-text">
              No learning plans found. Start by creating your first plan!
            </Typography>
          </Paper>
        ) : (
          <List>
            {plans.map((plan) => (
              <Paper key={plan.id} className="plan-card">
                <ListItem className="plan-item">
                  <ListItemText
                    primary={<Typography variant="h6" className="plan-title">{plan.title}</Typography>}
                    secondary={
                      <>
                        <Typography variant="body2" className="plan-deadline">
                          <CalendarToday fontSize="small" /> {format(new Date(plan.deadline), 'MMM dd, yyyy')}
                        </Typography>
                        {plan.description && (
                          <Typography variant="body2" className="plan-desc">
                            {plan.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                  <ListItemSecondaryAction className="action-buttons">
                    <IconButton onClick={() => editPlan(plan)}><Edit /></IconButton>
                    <IconButton onClick={() => deletePlan(plan.id)} color="error"><Delete /></IconButton>
                    <Link to={`/learningplans/${plan.id}`}>
                      <Button variant="contained" color="primary">More Details</Button>
                    </Link>
                  </ListItemSecondaryAction>
                </ListItem>
                {plan.tasks && plan.tasks.length > 0 && (
                  <>
                    <Divider />
                    <Box className="progress-box">
                      <Typography variant="subtitle2" className="progress-label">
                        Progress ({Math.round(calculateProgress(plan.tasks))}%)
                      </Typography>
                      <LinearProgress variant="determinate" value={calculateProgress(plan.tasks)} className="progress-bar" />
                      <List dense>
                        {plan.tasks.map((task, idx) => (
                          <ListItem key={idx}
                           className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
                            <Checkbox edge="start" checked={task.isCompleted} disabled size="small" />
                            <ListItemText primary={task.description} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </>
                )}
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default LearningPlanCRUD;
