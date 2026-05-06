import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, Lock, 
  UserCog, Factory, FileSearch, 
  AlertCircle, ChevronRight
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

// --- 1. ส่วนแสดงข้อมูลสถานประกอบการ ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        setCompanies(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Companies Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
        <Factory size={24}/> รายชื่อสถานประกอบการ
      </h3>
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-400 font-bold animate-pulse">กำลังดึงข้อมูล...</p>
        ) : companies.length > 0 ? (
          companies.map((company, index) => (
            <div key={company.id || index} className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-red-50/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-[#800000]">{index + 1}</div>
                <div>
                  <p className="font-black text-gray-800">{company.name}</p>
                  <p className="text-xs text-gray-400 font-bold">{company.address || 'ไม่มีข้อมูลที่อยู่'}</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300" />
            </div>
          ))
        ) : (
          <p className="text-center py-10 text-gray-400 font-bold">ไม่พบข้อมูลบริษัทในระบบ</p>
        )}
      </div>
    </div>
  );
};

// --- 2. หน้า Login (แก้ไขให้ส่ง student_id เป็น String) ---
const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ปรับปรุง Payload: ส่ง student_id เป็น String ตามที่ Backend แจ้ง Error มา
      const payload = {
        student_id: String(username), 
        password: String(password)
      };

      console.log("🚀 กำลังส่ง Payload ไปยัง Backend:", payload);

      const response = await axios.post(`${API_BASE_URL}/student/login`, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      // ดึง access_token จาก response ตามโครงสร้าง FastAPI
      const token = response.data.access_token;
      
      if (token) {
        localStorage.setItem('token', token);
        onLogin({ ...response.data, student_id: username });
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // กรณีเกิด Error 422 จะทำการแจ้งเตือนโครงสร้างที่ Backend ต้องการ
        console.error("❌ Validation Error Detail:", error.response.data.detail);
        alert("ข้อมูลไม่ถูกต้อง (422): " + JSON.stringify(error.response.data.detail));
      } else {
        const msg = error.response?.data?.detail || "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
        alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-['Sarabun'] antialiased">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#800000]"></div>
        <div className="text-center mb-10">
          <div className="bg-red-50 w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto mb-6">
            <Lock className="text-[#800000]" size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Student Login</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase mt-2">Co-operative Education</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">รหัสนักศึกษา</label>
            <input 
              type="text" 
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all" 
              placeholder="กรอกรหัสนักศึกษา"
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
            className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black transition-all transform active:scale-95"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 3. หน้า Dashboard หลัก ---
const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-24'} bg-[#800000] text-white transition-all duration-300 flex flex-col z-20`}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && <span className="font-black text-xl uppercase">Co-Op</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === 'overview' ? 'bg-white text-[#800000]' : 'text-red-100/70 hover:bg-white/5'}`}>
            <BarChart3 size={20} />
            {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase">ภาพรวม</span>}
          </button>
          <button onClick={() => setActiveTab('company')} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === 'company' ? 'bg-white text-[#800000]' : 'text-red-100/70 hover:bg-white/5'}`}>
            <Factory size={20} />
            {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase">สถานประกอบการ</span>}
          </button>
          <button onClick={() => setActiveTab('request')} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === 'request' ? 'bg-white text-[#800000]' : 'text-red-100/70 hover:bg-white/5'}`}>
            <FileSearch size={20} />
            {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase">คำร้องของฉัน</span>}
          </button>
        </nav>
        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full p-4 text-red-200 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-10">
          <h2 className="font-black text-gray-800 uppercase tracking-wide">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-gray-400 uppercase">STUDENT ID</p>
              <p className="text-sm font-black text-gray-800">{userData?.student_id || 'N/A'}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#800000] to-red-900 flex items-center justify-center text-white font-black shadow-lg">S</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-[#800000] p-10 rounded-[35px] text-white shadow-2xl">
                  <h3 className="text-2xl font-black mb-2">ยินดีต้อนรับสู่ระบบสหกิจศึกษา</h3>
                  <p className="opacity-70 font-bold">เชื่อมต่อข้อมูลนักศึกษาเรียบร้อยแล้ว</p>
                </div>
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4">
                  <AlertCircle className="text-blue-600" />
                  <p className="text-blue-700 font-bold text-sm">Server Connected: {API_BASE_URL}</p>
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
    </div>
  );
};

export default StudentDashboard;