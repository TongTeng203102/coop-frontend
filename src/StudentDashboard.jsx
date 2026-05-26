import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, Lock, 
  Factory, FileSearch, AlertCircle, 
  ChevronRight, User, MapPin, Phone, 
  Building2, Info, Filter,
  CheckCircle2, Clock, Calendar, GraduationCap
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Component โลโก้หุ่นยนต์เฟืองสีแดง ---
const RobotLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M482.3 221.7l-35.9-5.9c-3.9-15.6-9.9-30.4-17.7-44l21.3-29.4c6.3-8.7 5.1-20.9-2.9-28.2l-32.9-30c-7.9-7.2-20.2-7.2-28 0l-22.5 19.3c-14.1-8.9-29.6-15.6-46.1-19.8l-7-35.7C312 36.5 302 28 290.3 28h-44.5c-11.7 0-21.7 8.5-23.4 20l-7 35.7c-16.5 4.2-32 10.9-46.1 19.8L146.8 84.2c-7.8-7.2-20.1-7.2-28 0l-32.9 30c-8 7.3-9.2 19.5-2.9 28.2l21.3 29.4c-7.8 13.6-13.8 28.4-17.7 44l-35.9 5.9C39 223.4 30.5 233.1 30.5 244.7v44.5c0 11.6 8.5 21.3 20.2 23l35.9 5.9c3.9 15.6 9.9 30.4 17.7 44l-21.3 29.4c-6.3 8.7-5.1 20.9 2.9 28.2l32.9 30c7.9 7.2 20.2 7.2 28 0l22.5-19.3c14.1 8.9 29.6 15.6 46.1 19.8l7 35.7c1.7 11.5 11.7 20 23.4 20h44.5c11.7 0 21.7-8.5 23.4-20l7-35.7c16.5-4.2 32-10.9 46.1-19.8l22.5 19.3c7.8 7.2 20.1 7.2 28 0l32.9-30c8-7.3 9.2-19.5 2.9-28.2l-21.3-29.4c7.8-13.6 13.8-28.4 17.7-44l35.9-5.9c11.7-1.7 20.2-11.4 20.2-23v-44.5c0-11.6-8.5-21.3-20.2-23z" fill="#ff4d4d" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="256" cy="256" r="135" fill="#fff" stroke="#000" strokeWidth="16"/>
    <rect x="180" y="210" width="152" height="100" rx="25" fill="#e0e0e0" stroke="#000" strokeWidth="16"/>
    <circle cx="225" cy="260" r="14" fill="#000"/>
    <circle cx="287" cy="260" r="14" fill="#000"/>
    <rect x="148" y="235" width="32" height="50" rx="16" fill="#b0b0b0" stroke="#000" strokeWidth="16"/>
    <rect x="332" y="235" width="32" height="50" rx="16" fill="#b0b0b0" stroke="#000" strokeWidth="16"/>
    <line x1="256" y1="210" x2="256" y2="175" stroke="#000" strokeWidth="16" strokeLinecap="round"/>
    <circle cx="256" cy="160" r="18" fill="#ff4d4d" stroke="#000" strokeWidth="12"/>
    <line x1="230" y1="290" x2="282" y2="290" stroke="#000" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

// --- 1. ส่วนแสดงข้อมูลสถานประกอบการ ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredCompanies = companies.filter(company => {
    if (filterIndustry === 'All') return true;
    if (filterIndustry === 'Industry') return company.industry?.includes('อุตสาหกรรม') || company.industry?.toLowerCase().includes('manufacture');
    if (filterIndustry === 'IT') return company.industry?.includes('เทคโนโลยี') || company.industry?.toLowerCase().includes('it') || company.industry?.toLowerCase().includes('tech');
    if (filterIndustry === 'Other') return !company.industry;
    return true;
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
          <Factory size={24}/> รายชื่อสถานประกอบการ
        </h3>
        
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
          
          <div className="relative">
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${showFilterMenu ? 'bg-[#800000] text-white border-[#800000]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
            >
              <Filter size={18} />
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
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

      {selectedCompany && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
      const payload = { username: String(username), password: String(password) };
      const response = await axios.post(`${API_BASE_URL}/login`, payload);
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        onLogin();
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
        <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <RobotLogo className="w-20 h-20" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 uppercase mb-8 tracking-tighter">เข้าสู่ระบบ</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input 
            type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all" 
            placeholder="รหัสนักศึกษา" value={username} onChange={(e) => setUsername(e.target.value)} required 
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
  
  const [studentData, setStudentData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  // ดึงข้อมูลนักศึกษาจาก /student/me
  useEffect(() => {
    if (isLoggedIn) {
      const fetchStudentProfile = async () => {
        try {
          setFetchingUser(true);
          const response = await api.get('/student/me');
          
          console.log("Raw API Response:", response.data);

          // 🛠️ ตรวจสอบอย่างละเอียด: ถ้า API ส่งกลับมาเป็น Array ให้เอาตัวแรก [0] มาใช้
          if (Array.isArray(response.data)) {
            setStudentData(response.data[0]);
          } else if (response.data?.user) {
            setStudentData(Array.isArray(response.data.user) ? response.data.user[0] : response.data.user);
          } else {
            setStudentData(response.data);
          }

        } catch (error) {
          console.error("Error fetching student profile:", error);
          if (error.response?.status === 401) {
            localStorage.clear();
            setIsLoggedIn(false);
          }
        } finally {
          setFetchingUser(false);
        }
      };
      fetchStudentProfile();
    }
  }, [isLoggedIn]);

  // --- 🛠️ แมตช์ตัวแปรตรงกับโครงสร้าง JSON จริง ---
  const studentId = studentData?.student_id || '-';
  
  // นำ first_name มารวมกับ last_name (เช่น Kasidet Masang)
  const studentFullName = studentData?.first_name && studentData?.last_name 
    ? `${studentData.first_name} ${studentData.last_name}`
    : 'กำลังโหลดข้อมูลชื่อ...';

  const studentFaculty = studentData?.faculty || 'ไม่ระบุคณะ';
  const studentMajor = studentData?.major || 'ไม่ระบุสาขา';
  const studentPhone = studentData?.phone || '-';

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      {/* Sidebar เมนูด้านซ้าย */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24">
          <div className="flex items-center gap-3">
            <RobotLogo className="w-12 h-12 drop-shadow-md" />
            {(isSidebarOpen || window.innerWidth < 768) && (
              <span className="font-black text-xl uppercase tracking-tighter text-white animate-in fade-in duration-300">
                CO-OP SYSTEM
              </span>
            )}
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute right-4 md:hidden p-2 hover:bg-white/10 rounded-xl">
              <X size={20} />
            </button>
          )}
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

        <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); setStudentData(null); }} className="p-8 flex items-center text-red-200 hover:text-white transition-colors border-t border-white/5">
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">LOGOUT</span>}
        </button>
      </aside>

      {/* พื้นที่เนื้อหาหลักด้านขวา */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header แถบบน */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all">
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-black text-gray-800 uppercase tracking-wide">{activeTab === 'overview' ? 'Dashboard' : activeTab}</h2>
          </div>
          
          {/* ข้อมูลโปรไฟล์มุมขวาบน */}
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">
                {fetchingUser ? 'กำลังโหลด...' : `ID: ${studentId}`}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-green-600 uppercase">ออนไลน์</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black shadow-md shadow-red-900/20">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* ส่วนกระดานบอร์ดเนื้อหาหลัก */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {activeTab === 'overview' && (
              <>
                {/* 1. ส่วนต้อนรับและข้อมูลส่วนตัวนักศึกษา */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* แบนเนอร์แดงต้อนรับ */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-black mb-2">
                      {fetchingUser ? 'สวัสดีนักศึกษา' : `สวัสดีคุณ ${studentFullName}!`}
                    </h3>
                    <p className="opacity-80 text-xs md:text-sm font-medium max-w-sm leading-relaxed">ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา ตรวจสอบสถานะคำร้องและข้อมูลบริษัทชั้นนำได้ทันที</p>
                    <Factory className="absolute -right-6 -bottom-10 w-48 h-48 text-white/5 rotate-12 pointer-events-none" />
                  </div>

                  {/* การ์ดข้อมูลส่วนตัวของนักศึกษา */}
                  <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-red-50 text-[#800000] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">ข้อมูลส่วนตัวนักศึกษา</span>
                      
                      {fetchingUser ? (
                        <div className="py-6 text-center text-xs text-gray-400 font-bold animate-pulse">กำลังดึงข้อมูล...</div>
                      ) : (
                        <div className="flex items-center gap-3 mt-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500"><GraduationCap size={24} /></div>
                          <div>
                            <p className="text-sm font-black text-gray-800">{studentFullName}</p>
                            <p className="text-xs text-gray-400 font-bold">รหัส: {studentId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-50 pt-3 mt-4 space-y-1.5 text-xs text-gray-500 font-bold">
                      <p>คณะ: <span className="text-gray-700 font-black">{studentFaculty}</span></p>
                      <p>สาขา: <span className="text-gray-700 font-black">{studentMajor}</span></p>
                      <p>เบอร์โทร: <span className="text-gray-700 font-black">{studentPhone}</span></p>
                      <p>เทอมที่ลงทะเบียน: <span className="text-[#800000] font-black">ภาคเรียนที่ {studentData?.semester || '1'}</span></p>
                    </div>
                  </div>
                </div>

                {/* 2. กราฟสรุปคำร้องทั้งหมด */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-6 flex items-center gap-2"><BarChart3 size={20} className="text-[#800000]"/> กราฟสรุปสถานะคำร้องทั้งหมด</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 mb-1">อนุมัติแล้ว (Approved)</p>
                        <h5 className="text-2xl font-black text-emerald-700">2 <span className="text-xs font-bold text-emerald-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full border-4 border-emerald-400 flex items-center justify-center text-xs font-black text-emerald-700 shadow-sm">100%</div>
                    </div>

                    <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-amber-600 mb-1">กำลังตรวจสอบ (Pending)</p>
                        <h5 className="text-2xl font-black text-amber-700">1 <span className="text-xs font-bold text-amber-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full border-4 border-amber-300 flex items-center justify-center text-xs font-black text-amber-700 shadow-sm">50%</div>
                    </div>

                    <div className="p-5 bg-red-50/40 border border-red-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-red-600 mb-1">ปฏิเสธ/แก้ไข (Rejected)</p>
                        <h5 className="text-2xl font-black text-red-700">0 <span className="text-xs font-bold text-red-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-16 h-16 bg-white rounded-full border-4 border-gray-200 flex items-center justify-center text-xs font-black text-gray-400 shadow-sm">0%</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">เปรียบเทียบอัตราส่วนคำร้อง</p>
                    <div className="w-full h-4 bg-gray-100 rounded-full flex overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all" style={{width: '66%'}}></div>
                      <div className="h-full bg-amber-400 transition-all" style={{width: '34%'}}></div>
                      <div className="h-full bg-red-400 transition-all" style={{width: '0%'}}></div>
                    </div>
                    <div className="flex gap-4 mt-3 text-[11px] font-bold text-gray-500">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> อนุมัติ (66%)</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span> รอตรวจ (34%)</span>
                    </div>
                  </div>
                </div>

                {/* 3. ไทม์ไลน์ขั้นตอนการฝึกงาน */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-8 flex items-center gap-2"><Calendar size={20} className="text-[#800000]"/> ไทม์ไลน์ขั้นตอนการดำเนินงาน (Co-op Timeline)</h4>
                  
                  <div className="relative border-l-2 border-red-100 ml-4 md:ml-6 space-y-8 pb-4">
                    <div className="relative pl-8">
                      <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                      <div>
                        <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">เสร็จสิ้นแล้ว</span>
                        <h5 className="text-sm font-black text-gray-800 mt-1">ยื่นใบสมัครและเลือกสถานประกอบการ</h5>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">ส่งเอกสารคำร้องแจ้งความประสงค์ฝึกงานเข้าระบบ</p>
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute -left-[13px] top-0 bg-amber-400 text-white p-1 rounded-full"><Clock size={16} /></div>
                      <div>
                        <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-md">กำลังดำเนินงาน</span>
                        <h5 className="text-sm font-black text-gray-800 mt-1">อาจารย์และเจ้าหน้าที่ตรวจสอบคำร้อง</h5>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">อยู่ระหว่างการพิจารณาคุณสมบัติและความเหมาะสมของบริษัท</p>
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute -left-[13px] top-0 bg-gray-200 text-gray-400 p-1 rounded-full"><Clock size={16} /></div>
                      <div className="opacity-50">
                        <span className="text-[10px] text-gray-500 font-black bg-gray-100 px-2 py-0.5 rounded-md">ยังไม่ถึงขั้นตอน</span>
                        <h5 className="text-sm font-black text-gray-800 mt-1">ออกหนังสือส่งตัวไปยังบริษัท</h5>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">จัดส่งเอกสารราชการให้กับฝ่ายบุคคล (HR) ของสถานประกอบการ</p>
                      </div>
                    </div>

                    <div className="relative pl-8">
                      <div className="absolute -left-[13px] top-0 bg-gray-200 text-gray-400 p-1 rounded-full"><Clock size={16} /></div>
                      <div className="opacity-50">
                        <span className="text-[10px] text-gray-500 font-black bg-gray-100 px-2 py-0.5 rounded-md">ยังไม่ถึงขั้นตอน</span>
                        <h5 className="text-sm font-black text-gray-800 mt-1">ออกปฏิบัติงานสหกิจศึกษาและบันทึกรายงาน</h5>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">เข้าฝึกงาน ณ สถานที่จริง และส่งบันทึกประจำสัปดาห์</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'company' && <CompanyManagement />}
            
            {activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">ไม่พบรายการคำร้องเพิ่มเติม</h3>
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