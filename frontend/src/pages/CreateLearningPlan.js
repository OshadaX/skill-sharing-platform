import React, { useState } from 'react';

const CreateLearningPlan = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const newPlan = {
      title,
      description,
      startDate,
      endDate,
      assignedTo
    };

    fetch('/api/learning-plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPlan)
    })
      .then(response => response.json())
      .then(data => {
        setMessage('Learning plan created successfully!');
        // Optionally reset form fields after success
        setTitle('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        setAssignedTo('');
      })
      .catch(error => {
        setMessage('Error creating learning plan: ' + error.message);
      });
  };

  return (
    <div>
      <h1>Create New Learning Plan</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <label>Assigned To:</label>
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
        />
        <button type="submit">Create Learning Plan</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateLearningPlan;
