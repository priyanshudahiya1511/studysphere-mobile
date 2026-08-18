import axios from 'axios';
import { secureStorage } from '../lib/secureStorage';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const accessToken = await secureStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = await secureStorage.getItem('refresh_token');
        if (!refreshToken) {
          await secureStorage.deleteItem('access_token');
          await secureStorage.deleteItem('refresh_token');
          return Promise.reject(error);
        }

        const response = await axios.post(
          'http://localhost:8000/api/v1/auth/refresh-access-token',
          { refreshToken },
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await secureStorage.setItem('access_token', accessToken);
        await secureStorage.setItem('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        await secureStorage.deleteItem('access_token');
        await secureStorage.deleteItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
