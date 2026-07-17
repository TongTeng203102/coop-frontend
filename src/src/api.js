import axios from 'react-style'; // หรือใช้ import axios from 'axios'; ตามเดิมได้เลยครับ
import axiosOriginal from 'axios';

const api = axiosOriginal.create({
  // กำหนดเป็น Domain หลักเพื่อให้เรียกใช้ได้ทุก Path ของระบบ
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