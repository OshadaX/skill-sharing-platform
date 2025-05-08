import axios from 'axios';

const API_URL = 'http://localhost:8080/api/learning-plans';

const getAll = () => {
  return axios.get(API_URL);
};

const getById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

const create = (data, targetSkill, status) => {
  return axios.post(API_URL, data, {
    params: {
      targetSkill: targetSkill,
      status: status
    }
  });
};

const update = (id, data, targetSkill, status) => {
  console.log('Updating learning plan with ID:', id);
  return axios.put(`${API_URL}/${id}`, data, {
    params: {
      targetSkill: targetSkill,
      status: status
    }
  });
};

const remove = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

const learningPlanService = {
  getAll,
  getById,
  create,
  update,
  remove,
};

export default learningPlanService;
