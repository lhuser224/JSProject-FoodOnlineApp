import axios from 'axios';

/**
 * Axios client instance with global configuration
 * baseURL: /FoodO
 * Includes request/response interceptors for authentication and error handling
 */
const axiosClient = axios.create({
  baseURL: '/FoodO',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor
 * - Add Authorization header if token exists in localStorage
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * - Extract response.data automatically
 * - Handle global errors (401, 403, 500, etc.)
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Return only the data portion
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    // Handle specific error cases
    if (status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/auth';
    } else if (status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
    } else if (status === 500) {
      console.error('Server Error: Please try again later');
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
