import api from './index';

export const createProject = async ({ templateKey, engineType }) => {
  const res = await api.post('/projects', { templateKey, engineType });
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

export const getProject = async (id) => {
  const res = await api.get(`/projects/${id}`);
  return res.data;
};

export const updateProject = async (id, config) => {
  const res = await api.put(`/projects/${id}`, config);
  return res.data;
};