import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, LogOut, Menu, X, 
  Factory, FileSearch, 
  ChevronRight, User, MapPin, Phone, 
  Building2, Info, Filter,
  CheckCircle2, Clock, Calendar, GraduationCap,
  Mail, PlusCircle, Check, AlertCircle, TrendingUp
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

// สร้างตัวแปรสำหรับยิง API ทั่วไป
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Component โลโก้หุ่นยนต์เฟืองสีแดง ---
const RobotLogo = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M482.3 221.7l-35.9-5.9c-3.9-15.6-9.9-30.4-17.7-44l21.3-29.4c6.3-8.7 5.1-20.9-2.9-28.2l-32.9-30c-7.9-7.2-20.2-7.2-28 0l-22.5 19.3c-14.1-8.9-29.6-15.6-46.1-19.8l-7-35.7C312 36.5 302 28 290.3 28h-44.5c-11.7 0-21.7 8.5-23.4 20l-7 35.7c-16.5 4.2-32 10.9-46.1 19.8L146.8 84.2c-7.8-7.2-20.1-7.2-28 0l-32.9 30c-8 7.3-9.2 19.5-2.9 28.2l21.3 29.4c-7.8 13.6-13.8 28.4-17.7 44l-35.9 5.9C39 223.4 30.5 233.1 30.5 244.7v44.5c0 11.6 8.5 21.3 20.2 23l35.9 5.9c3.9 15.6 9.9 30.4 17.7 44l-21.3 29.4c-6.3 8.7-5.1 20.9 2.9 28.2l32.9 30c7.9 7.2 20.2 7.2 28 0l22.5-19.3c14.1 8.9-29.6 15.6-46.1 19.8l7 35.7c1.7 11.5 11.7 20 23.4 20h44.5c11.7 0 21.7-8.5 23.4-20l7-35.7c16.5-4.2 32-10.9 46.1-19.8l22.5 19.3c7.8 7.2 20.1 7.2 28 0l32.9-30c8-7.3 9.2-19.5 2.9-28.2l-21.3-29.4c7.8-13.6 13.8-28.4 17.7-44l35.9-5.9c11.7-1.7 20.2-11.4 20.2-23v-44.5c0-11.6-8.5-21.3-20.2-23z" fill="#ff4d4d" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
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

// --- 1. ส่วนแสดงข้อมูลและระบบเลือกสถานประกอบการ ---
const CompanyManagement = ({ onSelectCompany }) => {
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
                  <p className="text-xs text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {company.address}
                  </p>
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

            <div className="p-8 space-y-6 max-h-[50vh] overflow-y-auto">
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
                    <p className="text-gray-800 font-bold">{selectedCompany.phone || "ไม่ระบุ"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-between gap-4">
              <button onClick={() => setSelectedCompany(null)} className="px-6 py-3 bg-white text-gray-600 rounded-2xl font-black border border-gray-200">
                ปิดหน้าต่าง
              </button>
              {/* 🛠️ ระบบคำร้องเลือกสถานประกอบการ */}
              <button 
                onClick={() => {
                  onSelectCompany(selectedCompany.company_name);
                  setSelectedCompany(null);
                }} 
                className="px-8 py-3 bg-[#800000] text-white rounded-2xl font-black hover:bg-black transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> ยื่นคำร้องเลือกที่นี่
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

// --- 3. Main Dashboard Component ---
const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [studentData, setStudentData] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  // --- Mock State สำหรับ 6 ระบบใหม่ ---
  const [requests, setRequests] = useState([
    { id: 1, type: 'เลือกสถานประกอบการ', detail: 'บริษัท เทคโนโลยีล้ำสมัย จำกัด', status: 'Pending', studentName: 'กษิดิ์เดช มีแสง', date: '2026-06-01' },
    { id: 2, type: 'เสนอสถานประกอบการใหม่', detail: 'บริษัท นวัตกรรมซอฟต์แวร์ ประเทศไทย', status: 'Approved', studentName: 'กษิดิ์เดช มีแสง', date: '2026-05-28' }
  ]);

  const [newCompany, setNewCompany] = useState({ name: '', address: '', phone: '', position: '' });
  const [emailLogs, setEmailLogs] = useState([]);
  
  const [events, setEvents] = useState([
    { id: 1, title: 'เปิดรับสมัครเข้าร่วมสหกิจศึกษา', date: '1 มิ.ย. 2026 - 30 มิ.ย. 2026', type: 'info' },
    { id: 2, title: 'ปฐมนิเทศนักศึกษาก่อนออกปฏิบัติงาน', date: '10 ก.ค. 2026', type: 'warning' },
    { id: 3, title: 'ส่งเล่มรายงานสหกิจศึกษาฉบับสมบูรณ์', date: '15 ต.ค. 2026', type: 'danger' }
  ]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'info' });

  // ดึงข้อมูลนักศึกษา
  useEffect(() => {
    if (isLoggedIn) {
      const fetchStudentProfile = async () => {
        try {
          setFetchingUser(true);
          const token = localStorage.getItem('token');
          const response = await axios.get('https://coop-backend-02.vercel.app/student/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (Array.isArray(response.data)) {
            setStudentData(response.data[0]);
          } else if (response.data?.user) {
            setStudentData(Array.isArray(response.data.user) ? response.data.user[0] : response.data.user);
          } else {
            setStudentData(response.data);
          }
        } catch (error) {
          console.error("Error fetching student profile:", error);
        } finally {
          setFetchingUser(false);
        }
      };
      fetchStudentProfile();
    }
  }, [isLoggedIn]);

  const studentId = studentData?.student_id || '6510110001';
  const studentFullName = studentData?.first_name && studentData?.last_name 
    ? `${studentData.first_name} ${studentData.last_name}`
    : 'กษิดิ์เดช มีแสง';

  const studentFaculty = studentData?.faculty || 'วิศวกรรมศาสตร์และเทคโนโลยี';
  const studentMajor = studentData?.major || 'วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์';
  const studentPhone = studentData?.phone || '081-234-5678';

  // 🛠️ 1. ฟังก์ชันระบบคำร้องเลือกสถานประกอบการ
  const handleSelectCompany = (companyName) => {
    const newReq = {
      id: requests.length + 1,
      type: 'เลือกสถานประกอบการ',
      detail: companyName,
      status: 'Pending',
      studentName: studentFullName,
      date: new Date().toISOString().split('T')[0]
    };
    setRequests([newReq, ...requests]);
    triggerEmailNotification("เจ้าหน้าที่ภาควิชา", `นักศึกษา ${studentFullName} ได้ยื่นคำร้องเลือกสถานประกอบการที่: ${companyName}`);
    alert(`ยื่นคำร้องเลือก ${companyName} สำเร็จ! ระบบได้ส่งอีเมลแจ้งเตือนไปยังอาจารย์แล้ว`);
  };

  // 🛠️ 2. ฟังก์ชันระบบเสนอสถานประกอบการใหม่
  const handleProposeCompany = (e) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.address) return;
    const newReq = {
      id: requests.length + 1,
      type: 'เสนอสถานประกอบการใหม่',
      detail: `${newCompany.name} (ตำแหน่ง: ${newCompany.position || 'ไม่ระบุ'})`,
      status: 'Pending',
      studentName: studentFullName,
      date: new Date().toISOString().split('T')[0]
    };
    setRequests([newReq, ...requests]);
    triggerEmailNotification("อาจารย์ที่ปรึกษา", `มีการเสนอสถานประกอบการใหม่จากนักศึกษา: ${newCompany.name}`);
    alert(`เสนอสถานประกอบการ ${newCompany.name} เข้าสู่ระบบสำเร็จ! รอการตรวจสอบอนุมัติ`);
    setNewCompany({ name: '', address: '', phone: '', position: '' });
  };

  // 🛠️ 3. ฟังก์ชันระบบอนุมัติคำร้อง (ฝั่งอาจารย์/เจ้าหน้าที่)
  const handleApproveReject = (id, newStatus) => {
    setRequests(requests.map(req => {
      if (req.id === id) {
        triggerEmailNotification(req.studentName, `คำร้อง "${req.type} - ${req.detail}" ของคุณได้รับการ ${newStatus === 'Approved' ? 'อนุมัติเรียบร้อยแล้ว' : 'ปฏิเสธ/ให้แก้ไข'}`);
        return { ...req, status: newStatus };
      }
      return req;
    }));
  };

  // 🛠️ 4. ฟังก์ชันระบบกำหนดการกิจกรรม
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;
    setEvents([...events, { id: events.length + 1, ...newEvent }]);
    setNewEvent({ title: '', date: '', type: 'info' });
  };

  // 🛠️ 5. ฟังก์ชันระบบจำลองแจ้งเตือนทางอีเมล
  const triggerEmailNotification = (to, message) => {
    const newLog = {
      id: emailLogs.length + 1,
      to,
      message,
      time: new Date().toLocaleTimeString()
    };
    setEmailLogs([newLog, ...emailLogs]);
  };

  if (!isLoggedIn) return <LoginPage onLogin={() => setIsLoggedIn(true)} />;

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      
      {/* Sidebar เมนูด้านซ้าย */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24">
          <div className="flex items-center gap-3">
            <RobotLogo className="w-12 h-12 drop-shadow-md" />
            {(isSidebarOpen || window.innerWidth < 768) && (
              <span className="font-black text-xl uppercase tracking-tighter text-white">CO-OP SYSTEM</span>
            )}
          </div>
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', name: 'หน้าหลัก Dashboard', icon: <BarChart3 size={20}/> },
            { id: 'company', name: 'รายชื่อบริษัท & เลือกที่ฝึกงาน', icon: <Factory size={20}/> },
            { id: 'propose', name: 'เสนอที่ฝึกงานใหม่', icon: <PlusCircle size={20}/> },
            { id: 'approval', name: 'ระบบอนุมัติคำร้อง (Staff)', icon: <CheckCircle2 size={20}/> },
            { id: 'schedule', name: 'กำหนดการกิจกรรม', icon: <Calendar size={20}/> },
            { id: 'email', name: 'ระบบแจ้งเตือนอีเมล', icon: <Mail size={20}/> }
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg font-black' : 'text-red-100/70 hover:bg-white/5'}`}>
              {item.icon}
              {(isSidebarOpen || window.innerWidth >= 768) && <span className="ml-4 text-xs font-bold">{item.name}</span>}
            </button>
          ))}
        </nav>

        <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); setStudentData(null); }} className="p-8 flex items-center text-red-200 hover:text-white border-t border-white/5">
          <LogOut size={20} />
          {(isSidebarOpen || window.innerWidth >= 768) && <span className="ml-4 font-black text-xs">LOGOUT</span>}
        </button>
      </aside>

      {/* พื้นที่เนื้อหาหลักด้านขวา */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header แถบบน */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl">
              <Menu size={20} />
            </button>
            <h2 className="font-black text-gray-800 uppercase tracking-wide text-sm md:text-base">COOPERATIVE EDUCATION MANAGEMENT</h2>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">ID: {studentId}</p>
              <span className="text-[10px] font-bold text-green-600 uppercase">● Online</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black">
              <User size={20} />
            </div>
          </div>
        </header>

        {/* ส่วนกระดานบอร์ดเนื้อหาหลัก */}
        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
            
            {/* ================= TAB: OVERVIEW & REPORT ================= */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 rounded-[35px] text-white shadow-xl flex flex-col justify-center relative overflow-hidden">
                    <h3 className="text-2xl md:text-3xl font-black mb-2">สวัสดีคุณ {studentFullName}!</h3>
                    <p className="opacity-80 text-xs md:text-sm max-w-sm">ระบบจัดการสหกิจศึกษาแบบครบวงจร ยื่นคำร้อง ตรวจสอบสถานะ และดูรายงานสรุปแบบเรียลไทม์</p>
                  </div>

                  <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-red-50 text-[#800000] font-black px-2.5 py-1 rounded-md uppercase">ข้อมูลโปรไฟล์</span>
                      <p className="text-sm font-black text-gray-800 mt-3">{studentFullName}</p>
                      <p className="text-xs text-gray-400 font-bold mt-1">สาขา: {studentMajor}</p>
                    </div>
                    <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-500 font-bold">
                      เทอมลงทะเบียน: <span className="text-[#800000] font-black">ภาคเรียนที่ 1</span>
                    </div>
                  </div>
                </div>

                {/* 🛠️ 6. ระบบรายงานสรุปข้อมูล (Report Summary Dashboard) */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-6 flex items-center gap-2 text-base">
                    <TrendingUp size={20} className="text-[#800000]"/> ระบบรายงานสรุปข้อมูลภาพรวม (Real-time Report)
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                      <p className="text-xs font-bold text-blue-600 mb-1">คำร้องทั้งหมดในระบบ</p>
                      <h5 className="text-2xl font-black text-blue-700">{requests.length} <span className="text-xs font-bold">รายการ</span></h5>
                    </div>
                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl">
                      <p className="text-xs font-bold text-amber-600 mb-1">รอตรวจสอบ (Pending)</p>
                      <h5 className="text-2xl font-black text-amber-700">{requests.filter(r => r.status === 'Pending').length} <span className="text-xs font-bold">รายการ</span></h5>
                    </div>
                    <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <p className="text-xs font-bold text-emerald-600 mb-1">อนุมัติแล้ว (Approved)</p>
                      <h5 className="text-2xl font-black text-emerald-700">{requests.filter(r => r.status === 'Approved').length} <span className="text-xs font-bold">รายการ</span></h5>
                    </div>
                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl">
                      <p className="text-xs font-bold text-red-600 mb-1">ปฏิเสธแล้ว (Rejected)</p>
                      <h5 className="text-2xl font-black text-red-700">{requests.filter(r => r.status === 'Rejected').length} <span className="text-xs font-bold">รายการ</span></h5>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ================= TAB: COMPANY & SELECT ================= */}
            {activeTab === 'company' && (
              <CompanyManagement onSelectCompany={handleSelectCompany} />
            )}

            {/* ================= TAB: PROPOSE NEW COMPANY ================= */}
            {activeTab === 'propose' && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
                  <PlusCircle size={24}/> ระบบเสนอสถานประกอบการใหม่จากนักศึกษา
                </h3>
                <form onSubmit={handleProposeCompany} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">ชื่อสถานประกอบการ *</label>
                      <input 
                        type="text" required placeholder="เช่น บริษัท นวัตกรรม ไอที จำกัด"
                        className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000] font-bold text-sm"
                        value={newCompany.name} onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-2">ตำแหน่งงานที่ไปทำ</label>
                      <input 
                        type="text" placeholder="เช่น Full-stack Developer / AI Engineer"
                        className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000] font-bold text-sm"
                        value={newCompany.position} onChange={(e) => setNewCompany({...newCompany, position: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-2">ที่ตั้ง/ที่อยู่สถานประกอบการ *</label>
                    <textarea 
                      required rows="3" placeholder="ระบุเลขที่ ถนน แขวง เขต จังหวัด"
                      className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#800000] font-bold text-sm"
                      value={newCompany.address} onChange={(e) => setNewCompany({...newCompany, address: e.target.value})}
                    ></textarea>
                  </div>
                  <button type="submit" className="px-8 py-4 bg-[#800000] text-white font-black rounded-xl hover:bg-black transition-all">
                    ส่งข้อมูลเสนอสถานประกอบการ
                  </button>
                </form>
              </div>
            )}

            {/* ================= TAB: APPROVAL SYSTEM (STAFF) ================= */}
            {activeTab === 'approval' && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
                  <CheckCircle2 size={24}/> ระบบอนุมัติคำร้องสำหรับอาจารย์และเจ้าหน้าที่
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <th className="p-4">นักศึกษา</th>
                        <th className="p-4">ประเภทคำร้อง</th>
                        <th className="p-4">รายละเอียด</th>
                        <th className="p-4">สถานะ</th>
                        <th className="p-4 text-center">จัดการคำร้อง</th>
                      </tr>
                    </thead>
                    <tbody className="font-bold text-gray-700">
                      {requests.map(req => (
                        <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-4">{req.studentName}</td>
                          <td className="p-4"><span className="px-2.5 py-1 bg-red-50 text-[#800000] rounded-md text-xs">{req.type}</span></td>
                          <td className="p-4 text-gray-500">{req.detail}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs ${req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : req.status === 'Rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 flex justify-center gap-2">
                            {req.status === 'Pending' ? (
                              <>
                                <button onClick={() => handleApproveReject(req.id, 'Approved')} className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"><Check size={14}/></button>
                                <button onClick={() => handleApproveReject(req.id, 'Rejected')} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"><X size={14}/></button>
                              </>
                            ) : (
                              <span className="text-gray-300 text-xs font-normal">ประเมินแล้ว</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ================= TAB: SCHEDULE / ACTIVITY ================= */}
            {activeTab === 'schedule' && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
                  <Calendar size={24}/> ระบบกำหนดการกิจกรรมสหกิจศึกษา
                </h3>
                
                {/* ฟอร์มเพิ่มกิจกรรม (สำหรับ Staff วางคู่ในหน้าเดียวกัน) */}
                <form onSubmit={handleAddEvent} className="bg-gray-50 p-5 rounded-2xl mb-6 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">หัวข้อกิจกรรม/กำหนดการ</label>
                    <input type="text" required placeholder="เช่น วันสัมภาษณ์งาน" value={newEvent.title} onChange={(e) => setNewEvent({...newEvent, title: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl outline-none text-xs font-bold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">วันเวลา / ช่วงเวลา</label>
                    <input type="text" required placeholder="เช่น 25 ส.ค. 2026" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} className="w-full p-2.5 bg-white border rounded-xl outline-none text-xs font-bold" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-[#800000] text-white font-black text-xs rounded-xl hover:bg-black">เพิ่มกำหนดการใหม่</button>
                </form>

                <div className="space-y-4">
                  {events.map(ev => (
                    <div key={ev.id} className="p-4 border border-gray-100 rounded-2xl flex items-center gap-4 bg-white shadow-sm">
                      <div className="w-10 h-10 bg-red-50 text-[#800000] rounded-xl flex items-center justify-center shrink-0"><Calendar size={20}/></div>
                      <div>
                        <p className="font-black text-gray-800 text-sm">{ev.title}</p>
                        <p className="text-xs text-gray-400 font-bold mt-0.5">📅 กำหนดการ: {ev.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= TAB: EMAIL LOGS ================= */}
            {activeTab === 'email' && (
              <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-2">
                  <Mail size={24}/> ระบบบันทึกแจ้งเตือนทางอีเมล (Email Notification Logs)
                </h3>
                <p className="text-xs text-gray-400 font-bold mb-6">จำลองระบบการส่งข้อความอัตโนมัติ (Mailing Service) แจ้งอาจารย์และนักศึกษาเมื่อสถานะเปลี่ยนแปลง</p>
                
                <div className="space-y-3">
                  {emailLogs.length === 0 ? (
                    <div className="text-center py-10 text-gray-300 font-bold text-xs"><AlertCircle className="mx-auto mb-2 text-gray-200" />ยังไม่มีการส่งอีเมลในเซสชันนี้ (ลองไปกดส่งคำร้องหรือกดอนุมัติระบบจะส่งออโต้)</div>
                  ) : (
                    emailLogs.map(log => (
                      <div key={log.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex flex-col md:flex-row md:justify-between md:items-center text-xs gap-2 font-bold">
                        <div>
                          <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded mr-2">TO: {log.to}</span>
                          <span className="text-gray-600 font-medium">{log.message}</span>
                        </div>
                        <span className="text-gray-400 font-normal shrink-0">⏰ ส่งเมื่อ {log.time}</span>
                      </div>
                    ))
                  )}
                </div>
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