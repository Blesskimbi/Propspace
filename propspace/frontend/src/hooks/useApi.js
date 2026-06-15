import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Global interceptor - automatically adds token to every request
API.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('propspaceUser');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default API;