import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.includes('/auth')) {
          window.location.href = '/auth';
        }
      }
      return Promise.reject(error.response.data?.message || 'Server Error');
    }
    return Promise.reject('Network Error / Server Down');
  }
);

export default axiosClient;