import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, Lock, 
  UserCog, Factory, FileSearch, 
  AlertCircle, ChevronRight, User
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

// สร้าง Instance สำหรับเรียก API ทั่วไป (จะแนบ Token ให้อัตโนมัติ)
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 1. ส่วนแสดงข้อมูลสถานประกอบการ (Fetch ข้อมูลจาก /companies) ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // เรียกไปที่ https://coop-backend-02.vercel.app/companies
        const res = await api.get('/companies');
        // ตรวจสอบว่า data เป็น array หรือไม่ (ป้องกันกรณี Backend ส่ง error object มา)
        const data = Array.isArray(res.data) ? res.data : (res.data.companies || []);
        setCompanies(data);
      } catch (err) {
        console.error("Fetch Companies Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500">
      <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
        <Factory size={24}/> รายชื่อสถานประกอบการ
      </h3>
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
             <div className="animate-spin w-8 h-8 border-4 border-[#800000] border-t-transparent rounded-full mx-auto mb-4"></div>
             <p className="text-gray-400 font-bold">กำลังดึงข้อมูล...</p>
          </div>
        ) : companies.length > 0 ? (
          companies.map((company, index) => (
            <div key={company.id || index} className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-red-50/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-colors rounded-lg flex items-center justify-center font-bold text-[#800000]">{index + 1}</div>
                <div>
                  <p className="font-black text-gray-800">{company.name || company.company_name}</p>
                  <p className="text-xs text-gray-400 font-bold">{company.address || 'ประเทศไทย'}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-[#800000] transition-colors" />
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-400 font-bold">ไม่พบข้อมูลบริษัทในระบบ</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 2. หน้า Login (ปรับปรุง Payload ตามความต้องการของ Backend) ---
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        email: String(username), 
        password: String(password)
      };

      // ยิงไปที่ /login ตาม URL ใหม่
      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      const token = response.data.access_token;
      
      if (token) {
        localStorage.setItem('token', token);
        onLogin({ ...response.data, student_id: username });
      }
    } catch (error) {
      const msg = error.response?.data?.detail || "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-['Sarabun']">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-50 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#800000]"></div>
        <div className="bg-red-50 w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto mb-6">
          <Lock className="text-[#800000]" size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-8">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">อีเมล / ชื่อผู้ใช้งาน</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all" 
              placeholder="example@email.com"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">รหัสผ่าน</label>
            <input 
              type="password" 
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all" 
              placeholder="••••••••"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black transition-all transform active:scale-95 disabled:bg-gray-400"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 3. หน้า Dashboard หลัก (พร้อมระบบ Sidebar 3 ขีด) ---
const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // เริ่มต้นที่ false สำหรับ Mobile

  const handleLoginSuccess = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      
      {/* Overlay สำหรับมือถือเมื่อเปิดเมนู */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}
      `}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          {(isSidebarOpen || window.innerWidth < 768) && <span className="font-black text-xl uppercase">Co-Op</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-2">
          {[
            { id: 'overview', name: 'ภาพรวม', icon: <BarChart3 size={20}/> },
            { id: 'company', name: 'สถานประกอบการ', icon: <Factory size={20}/> },
            { id: 'request', name: 'คำร้องของฉัน', icon: <FileSearch size={20}/> }
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} 
              className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg' : 'text-red-100/70 hover:bg-white/5'}`}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase tracking-wider">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full p-4 text-red-200 hover:text-white hover:bg-red-900/50 rounded-2xl transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-gray-50 rounded-lg">
              <Menu size={20} />
            </button>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase">Status</p>
              <p className="text-sm font-black text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black shadow-lg">
              <User size={20} />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="bg-gradient-to-r from-[#800000] to-red-900 p-8 md:p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black mb-3">ยินดีต้อนรับสู่ระบบสหกิจศึกษา</h3>
                    <p className="opacity-80 font-medium">เข้าสู่ระบบสำเร็จ กำลังเชื่อมต่อกับฐานข้อมูลบริษัท...</p>
                  </div>
                  <Factory className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
                </div>
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                  <AlertCircle className="text-blue-600 shrink-0" />
                  <p className="text-blue-700 font-bold text-xs md:text-sm">Server: {API_BASE_URL}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'company' && <CompanyManagement />}
            
            {activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">ไม่มีรายการคำร้อง</h3>
                <p className="text-gray-400 text-sm mt-2 font-bold">คุณยังไม่ได้ยื่นคำร้องไปยังสถานประกอบการใดๆ</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
      `}} />
    </div>
  );
};

export default StudentDashboard;