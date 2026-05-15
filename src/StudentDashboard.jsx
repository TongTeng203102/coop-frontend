import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, Lock, 
  UserCog, Factory, FileSearch, 
  AlertCircle, ChevronRight, User, MapPin, Phone, Globe, Building2
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 1. ส่วนแสดงข้อมูลสถานประกอบการ (พร้อมระบบดูรายละเอียด) ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null); // เก็บข้อมูลบริษัทที่ถูกเลือก

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
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
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-500 relative">
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
            <div 
              key={company.id || index} 
              onClick={() => setSelectedCompany(company)} // เพิ่ม Event Click ตรงนี้
              className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-red-50/50 hover:border-red-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-colors rounded-lg flex items-center justify-center font-bold text-[#800000]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-black text-gray-800">{company.name || company.company_name}</p>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <MapPin size={12} /> {company.address || 'ประเทศไทย'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#800000] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs">
                ดูรายละเอียด <ChevronRight size={16} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-400 font-bold">ไม่พบข้อมูลบริษัทในระบบ</p>
          </div>
        )}
      </div>

      {/* --- Modal แสดงรายละเอียด --- */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            {/* Header Modal */}
            <div className="bg-[#800000] p-8 text-white">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#800000]">
                  <Building2 size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-black">{selectedCompany.name || selectedCompany.company_name}</h4>
                  <p className="text-red-100 opacity-80 font-medium">ข้อมูลรายละเอียดสถานประกอบการ</p>
                </div>
              </div>
            </div>

            {/* Content Modal */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">ที่ตั้ง/ที่อยู่</p>
                  <p className="text-gray-800 font-bold leading-relaxed">
                    {selectedCompany.address || 'ไม่ระบุข้อมูลที่อยู่'}
                  </p>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">เบอร์โทรศัพท์</p>
                  <p className="text-gray-800 font-black text-lg">
                    {selectedCompany.phone || selectedCompany.tel || 'ไม่มีข้อมูลติดต่อ'}
                  </p>
                </div>
              </div>

              <div className="p-5 bg-red-50/50 rounded-2xl border border-red-50">
                <p className="text-[10px] font-black text-[#800000] uppercase mb-1">รายละเอียดเพิ่มเติม/สวัสดิการ</p>
                <p className="text-gray-700 font-medium">
                  {selectedCompany.description || 'ไม่มีรายละเอียดเพิ่มเติมระบุไว้ในระบบ'}
                </p>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-black transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. หน้า Login ---
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

// --- 3. หน้า Dashboard หลัก ---
const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}
      `}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          {(isSidebarOpen || window.innerWidth < 768) && <span className="font-black text-xl uppercase tracking-tighter">Co-Op Portal</span>}
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
              {(isSidebarOpen || window.innerWidth < 768) && <span className="ml-4 text-xs font-black uppercase tracking-wider">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center w-full p-4 text-red-200 hover:text-white hover:bg-red-900/50 rounded-2xl transition-all">
            <LogOut size={20} />
            {(isSidebarOpen || window.innerWidth < 768) && <span className="ml-4 font-black text-xs uppercase">ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

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
                    <p className="opacity-80 font-medium">คุณสามารถค้นหาสถานประกอบการและยื่นคำร้องได้ที่เมนู "สถานประกอบการ"</p>
                  </div>
                  <Factory className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
                </div>
                <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
                  <AlertCircle className="text-blue-600 shrink-0" />
                  <p className="text-blue-700 font-bold text-xs md:text-sm">Server Status: เชื่อมต่อปกติ ({API_BASE_URL})</p>
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