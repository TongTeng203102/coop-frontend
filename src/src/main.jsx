import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // ดึงจาก App.jsx ที่แก้ไขใหม่
import './index.css'        // ดึง CSS ที่มีฟอนต์ Sarabun และ Tailwind

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)