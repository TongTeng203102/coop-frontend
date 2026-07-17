import axios from 'axios';

const api = axios.create({
  // กำหนดเป็น Domain หลักของ Backend
  baseURL: 'https://coop-backend-02.vercel.app' 
});

// Interceptor ดึง Token แนบไปกับ Header ทุก Request โดยอัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;