import axios from 'axios';
import { clearSession, getToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const payload = response.data as {
      success?: boolean;
      message?: string;
      data?: unknown;
    };

    if (typeof payload?.success === 'boolean') {
      if (!payload.success) {
        throw new Error(payload.message || 'Request failed');
      }
      response.data = payload.data;
    }

    return response;
  },
  (error) => {
    const status = error?.response?.status as number | undefined;
    const message =
      (error?.response?.data?.message as string | undefined) ||
      (error?.message as string | undefined) ||
      'Request failed';

    if (status === 401 && typeof window !== 'undefined') {
      clearSession();
      window.location.href = '/';
    }

    return Promise.reject(new Error(message));
  },
);

export default api;
