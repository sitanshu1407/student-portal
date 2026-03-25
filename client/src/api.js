import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers['x-auth-token'] = token;
  }
  return req;
});

// Auth APIs
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');
export const getUsers = () => API.get('/auth/users');
export const deleteUser = (id) => API.delete(`/auth/users/${id}`);

// Assignment APIs
export const getAssignments = () => API.get('/assignments');
export const createAssignment = (data) => API.post('/assignments', data);
export const updateAssignment = (id, data) => API.put(`/assignments/${id}`, data);
export const deleteAssignment = (id) => API.delete(`/assignments/${id}`);

// Note APIs
export const getNotes = () => API.get('/notes');
export const createNote = (data) => API.post('/notes', data);
export const updateNote = (id, data) => API.put(`/notes/${id}`, data);
export const deleteNote = (id) => API.delete(`/notes/${id}`);

export default API;
