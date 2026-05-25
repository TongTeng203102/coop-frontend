import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, Lock, 
  Factory, FileSearch, AlertCircle, 
  ChevronRight, User, MapPin, Phone, 
  Building2, Info, Usercog, Filter
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 1. ส่วนแสดงข้อมูลสถานประกอบการ (เพิ่มระบบตัวกรองด้านขวา) ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 🛠️ [เพิ่มสเตท]: สำหรับเปิด/ปิดแถบตัวกรอง และจำค่าประเภทที่เลือกกรอง
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [filterIndustry, setFilterIndustry] = useState('All');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await api.get('/companies', {
          params: searchTerm ? { search: searchTerm } : {}
        });
        const data = Array.isArray(res.data) ? res.data : (res.data.companies || []);
        setCompanies(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCompanies();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // 🛠️ [เพิ่มฟังก์ชัน]: กรองข้อมูลฝั่ง Frontend ตามประเภทอุตสาหกรรมที่เลือก
  const filteredCompanies = companies.filter(company => {
    if (filterIndustry === 'All') return true;
    if (filterIndustry === 'Industry') return company.industry?.includes('อุตสาหกรรม') || company.industry?.toLowerCase().includes('manufacture');
    if (filterIndustry === 'IT') return company.industry?.includes('เทคโนโลยี') || company.industry?.toLowerCase().includes('it') || company.industry?.toLowerCase().includes('tech');
    if (filterIndustry === 'Other') return !company.industry;
    return true;
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      {/* ส่วนหัวและตัวกรองมุมขวา */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
          <Factory size={24}/> รายชื่อสถานประกอบการ
        </h3>
        
        {/* กลุ่มค้นหาและไอคอนตัวกรองด้านขวา */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:flex-none">
            <input 
              type="text"
              placeholder="ค้นหาบริษัท (เช่น CP)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 px-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000] font-bold"
            />
          </div>
          
          {/* 🛠️ [เพิ่มปุ่มไอคอนตัวกรองมุมขวา] */}
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${showFilterMenu ? 'bg-[#800000] text-white border-[#800000]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
              title="ตัวกรองข้อมูล"
            >
              <Filter size={18} />
            </button>

            {/* เมนูตัวกรองที่จะเด้งลงมาเมื่อกดปุ่ม */}
            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <p className="px-4 py-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider">ประเภทธุรกิจ</p>
                {[
                  { id: 'All', name: 'ทั้งหมด' },
                  { id: 'Industry', name: 'โรงงาน / อุตสาหกรรม' },
                  { id: 'IT', name: 'IT / เทคโนโลยี' },
                  { id: 'Other', name: 'ทั่วไป / ไม่ระบุ' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFilterIndustry(type.id);
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors ${filterIndustry === type.id ? 'bg-red-50 text-[#800000]' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    • {type.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* แสดง Badge ตัวกรองปัจจุบันถ้ามีการเลือกไว้ */}
      {filterIndustry !== 'All' && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">ตัวกรองปัจจุบัน:</span>
          <span className="inline-flex items-center gap-1 bg-red-50 text-[#800000] text-xs font-black px-3 py-1 rounded-full border border-red-100">
            {filterIndustry === 'Industry' && 'โรงงาน / อุตสาหกรรม'}
            {filterIndustry === 'IT' && 'IT / เทคโนโลยี'}
            {filterIndustry === 'Other' && 'ทั่วไป / ไม่ระบุ'}
            <X size={12} className="cursor-pointer ml-1" onClick={() => setFilterIndustry('All')} />
          </span>
        </div>
      )}

      {/* รายการบริษัท */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-400 font-bold">กำลังดึงข้อมูล...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-bold">ไม่พบข้อมูลสถานประกอบการในกลุ่มนี้</div>
        ) : (
          filteredCompanies.map((company, index) => (
            <div 
              key={company.id || index} 
              onClick={() => setSelectedCompany(company)}
              className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:bg-red-50/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-[#800000] group-hover:text-white transition-colors rounded-lg flex items-center justify-center font-bold text-[#800000]">
                  {index + 1}
                </div>
                <div>
                  <p className="font-black text-gray-800">{company.company_name}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1">
                      <MapPin size={12} /> {company.address}
                    </p>
                    {company.industry && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-bold">
                        {company.industry}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-[#800000]" />
            </div>
          ))
        )}
      </div>

      {/* --- Modal แสดงรายละเอียด --- */}
      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden relative">
            <div className="bg-[#800000] p-8 text-white">
              <button onClick={() => setSelectedCompany(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#800000]">
                  <Building2 size={32} />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-black leading-tight">{selectedCompany.company_name}</h4>
                  <span className="inline-block mt-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
                    {selectedCompany.industry || "ทั่วไป"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex gap-3">
                  <MapPin className="text-[#800000] shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">ที่ตั้ง</p>
                    <p className="text-gray-800 font-bold">{selectedCompany.address}</p>
                  </div>
                </div>

                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex gap-3">
                  <Phone className="text-[#800000] shrink-0" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">เบอร์โทรศัพท์</p>
                    <p className="text-gray-800 font-black text-lg">
                      {selectedCompany.phone || "ไม่ระบุเบอร์โทร"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-red-50/30 rounded-3xl border border-red-100">
                <p className="text-[10px] font-black text-[#800000] uppercase mb-3 flex items-center gap-2">
                  <Info size={14} /> รายละเอียดและสวัสดิการ
                </p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">เบี้ยเลี้ยง</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.allowance || "ไม่มี"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">ที่พัก</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.accommodation || "ไม่มี"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">รถรับส่ง</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.shuttle || "ไม่มี"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">สวัสดิการอื่นๆ</p>
                    <p className="text-sm font-bold text-gray-700">{selectedCompany.welfare || "ไม่มี"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-end">
              <button onClick={() => setSelectedCompany(null)} className="px-10 py-3 bg-white text-gray-600 rounded-2xl font-black border border-gray-200 shadow-sm">
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
        username: String(username), 
        password: String(password) 
      };

      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        onLogin({ ...response.data, student_id: username });
      }
    } catch (error) {
      console.error("Login Error details:", error.response?.data);
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