import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, Lock, 
  Factory, FileSearch, AlertCircle, 
  ChevronRight, User, MapPin, Phone, 
  Building2, Info
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

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
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/companies');
        const data = Array.isArray(res.data) ? res.data : (res.data.companies || []);
        setCompanies(data);
      } catch (err) {
        console.error("Fetch Error:", err);
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
            <div 
              key={company.id || index} 
              onClick={() => setSelectedCompany(company)}
              className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-red-50/50 hover:border-red-100 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-colors rounded-lg flex items-center justify-center font-bold text-[#800000]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-black text-gray-800">{company.company_name}</p>
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                    <MapPin size={12} /> {company.address}
                  </p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-[#800000] transition-transform group-hover:translate-x-1" />
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
            <p className="text-gray-400 font-bold">ไม่พบข้อมูลบริษัทในระบบ</p>
          </div>
        )}
      </div>

      {/* --- Modal แสดงรายละเอียด (ปรับปรุงใหม่) --- */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
            
            {/* Header Section */}
            <div className="bg-[#800000] p-8 text-white relative">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-[#800000] shadow-xl">
                  <Building2 size={40} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl md:text-2xl font-black leading-tight mb-2">
                    {selectedCompany.company_name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold uppercase tracking-wider">
                      ID: {selectedCompany.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto bg-white">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ที่ตั้ง */}
                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-[#800000]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">สถานที่ตั้ง</p>
                    <p className="text-gray-800 font-bold text-sm leading-relaxed">
                      {selectedCompany.address}
                    </p>
                  </div>
                </div>

                {/* สายงาน (แทนที่เบอร์โทร) */}
                <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-[#800000]">
                    <UserCog size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">สายงาน / อุตสาหกรรม</p>
                    <p className="text-gray-800 font-black text-sm leading-relaxed italic">
                      {selectedCompany.industry || "ไม่ระบุสายงาน"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ข้อมูลสวัสดิการ */}
              <div className="p-8 bg-red-50/30 rounded-[35px] border border-red-100">
                <div className="flex items-center gap-2 mb-5">
                  <Info className="text-[#800000]" size={18} />
                  <p className="text-xs font-black text-[#800000] uppercase tracking-widest">ข้อมูลสวัสดิการและเบี้ยเลี้ยง</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase">เบี้ยเลี้ยง</p>
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#800000] rounded-full"></span>
                      {selectedCompany.allowance}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase">ที่พัก</p>
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#800000] rounded-full"></span>
                      {selectedCompany.accommodation}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase">รถรับส่ง</p>
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#800000] rounded-full"></span>
                      {selectedCompany.shuttle}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-400 font-black uppercase">สวัสดิการอื่นๆ</p>
                    <p className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#800000] rounded-full"></span>
                      {selectedCompany.welfare}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex justify-end">
              <button 
                onClick={() => setSelectedCompany(null)}
                className="px-12 py-3.5 bg-white hover:bg-gray-100 text-gray-600 rounded-2xl font-black shadow-sm border border-gray-200 transition-all active:scale-95"
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
      const payload = { email: String(username), password: String(password) };
      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        onLogin({ ...response.data, student_id: username });
      }
    } catch (error) {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-50 text-center">
        <div className="bg-red-50 w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto mb-6">
          <Lock className="text-[#800000]" size={40} />
        </div>
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-8 tracking-tighter">เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input 
            type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all" 
            placeholder="อีเมล / ชื่อผู้ใช้" value={username} onChange={(e) => setUsername(e.target.value)} required 
          />
          <input 
            type="password" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all" 
            placeholder="รหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} required 
          />
          <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black shadow-xl hover:bg-black transition-all">
            {loading ? 'กำลังเข้าระบบ...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 3. Main Dashboard ---
const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          {(isSidebarOpen || window.innerWidth < 768) && <span className="font-black text-xl uppercase tracking-tighter">CO-OP</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="flex-1 px-4 mt-8 space-y-2">
          {[
            { id: 'overview', name: 'หน้าหลัก', icon: <BarChart3 size={20}/> },
            { id: 'company', name: 'บริษัท', icon: <Factory size={20}/> },
            { id: 'request', name: 'คำร้อง', icon: <FileSearch size={20}/> }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg' : 'text-red-100/70 hover:bg-white/5'}`}>
              {item.icon}
              {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase">{item.name}</span>}
            </button>
          ))}
        </nav>
        <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }} className="p-8 flex items-center text-red-200 hover:text-white transition-colors">
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">LOGOUT</span>}
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b flex items-center justify-between px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-gray-50 rounded-lg"><Menu size={20} /></button>
          <h2 className="font-black text-gray-800 uppercase">{activeTab}</h2>
          <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black"><User size={20} /></div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/50">
          <div className="max-w-5xl mx-auto">
            {activeTab === 'overview' && (
              <div className="bg-gradient-to-br from-[#800000] to-red-900 p-12 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <h3 className="text-3xl font-black mb-2">ยินดีต้อนรับ</h3>
                <p className="opacity-80 font-medium">จัดการข้อมูลและค้นหาบริษัทที่คุณสนใจได้เลย</p>
                <Factory className="absolute -right-10 -bottom-10 w-64 h-64 text-white/10 rotate-12" />
              </div>
            )}
            {activeTab === 'company' && <CompanyManagement />}
            {activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">ไม่พบรายการคำร้อง</h3>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;800&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
      `}} />
    </div>
  );
};

export default StudentDashboard;