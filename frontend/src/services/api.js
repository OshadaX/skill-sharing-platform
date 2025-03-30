import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000
});

// Enhanced error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      // The request was made and server responded with error status
      console.error('Backend returned status code:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(error.response.data.message || 'Request failed');
    } else if (error.request) {
      // The request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request
      console.error('Request error:', error.message);
      throw new Error('Request setup error');
    }
  }
);

export const createLearningPlan = async (planData) => {
  try {
    const response = await api.post('/learning-plans', planData);
    return response;
  } catch (error) {
    console.error('Full error details:', error);
    throw error; // Re-throw to handle in component
  }
};