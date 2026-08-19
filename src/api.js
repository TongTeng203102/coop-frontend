import axios from 'axios';

// อัปเดต API Base URL เป็น Domain บน Vercel เรียบร้อยแล้ว
export const API_BASE_URL = 'https://coop-backend-02.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor ใส่ Token แนบไปกับ Request ทุกครั้งถ้ามี
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor จัดการกรณี Token หมดอายุ (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;