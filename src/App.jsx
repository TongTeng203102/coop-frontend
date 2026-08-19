import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Factory, FileSearch, ClipboardCheck, Users, 
  X, LogOut, Menu, User, GraduationCap, Calendar, 
  CheckCircle2, Clock, Bot, Search, RefreshCw, AlertCircle, Building2, MapPin, Phone
} from 'lucide-react';

import { API_BASE_URL } from './api';

// --- 1. Sub-Components สำหรับส่วนงานต่างๆ ---

const RobotLogo = ({ className = "w-12 h-12" }) => (
  <div className={`bg-white/10 rounded-2xl flex items-center justify-center p-2 text-white ${className}`}>
    <Bot size={28} />
  </div>
);

// --- Component แสดงรายชื่อสถานประกอบการ (เชื่อม API /companies) ---
const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/companies`);
      // รองรับกรณีข้อมูลถูกห่อไว้ในออบเจกต์ หรือส่งมาเป็น Array ตรงๆ
      const data = Array.isArray(response.data) ? response.data : (response.data.companies || response.data.data || []);
      setCompanies(data);
    } catch (err) {
      console.error('Fetch companies failed:', err);
      setError('ไม่สามารถดึงข้อมูลสถานประกอบการจากระบบได้');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // กรองข้อมูลบริษัทตามคำค้นหา
  const filteredCompanies = companies.filter((comp) => {
    const name = comp.name || comp.company_name || comp.name_th || '';
    const province = comp.province || comp.address || '';
    const searchTerm = search.toLowerCase();
    return name.toLowerCase().includes(searchTerm) || province.toLowerCase().includes(searchTerm);
  });

  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100 animate-fade-in">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <Factory size={22} className="text-[#800000]" /> รายชื่อสถานประกอบการ
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">
            สถานประกอบการที่เปิดรับนักศึกษาสหกิจศึกษาทั้งหมด ({companies.length} แห่ง)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 md:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="ค้นหาชื่อบริษัท หรือจังหวัด..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold outline-none focus:border-[#800000] transition-all"
            />
          </div>
          <button
            onClick={fetchCompanies}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-all"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-bold text-xs">
          <RefreshCw size={32} className="mx-auto mb-3 animate-spin text-[#800000]" />
          กำลังเชื่อมต่อดึงข้อมูลสถานประกอบการ...
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center">
          <AlertCircle size={36} className="mx-auto mb-2 text-red-500" />
          <p className="text-xs font-black text-red-700">{error}</p>
          <button
            onClick={fetchCompanies}
            className="mt-4 px-5 py-2 bg-[#800000] text-white text-xs font-bold rounded-xl hover:bg-black transition-all"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="py-20 text-center text-gray-400 font-bold text-xs border-2 border-dashed border-gray-100 rounded-3xl">
          <Building2 size={40} className="mx-auto mb-2 text-gray-300" />
          ไม่พบข้อมูลสถานประกอบการที่ตรงกับคำค้นหา
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-black">
                <th className="pb-3 pl-2">ชื่อสถานประกอบการ</th>
                <th className="pb-3">ที่อยู่ / พื้นที่</th>
                <th className="pb-3">ข้อมูลติดต่อ</th>
                <th className="pb-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCompanies.map((item, index) => (
                <tr key={item.id || item._id || index} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4 pl-2 font-black text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-[#800000] flex items-center justify-center shrink-0">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="font-black text-gray-800">{item.name || item.company_name || item.name_th || 'ไม่ระบุชื่อบริษัท'}</p>
                        {item.business_type && <p className="text-[10px] text-gray-400 font-bold">{item.business_type}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-gray-400 shrink-0" />
                      <span>{item.province || item.address || item.location || '-'}</span>
                    </div>
                  </td>
                  <td className="py-4 font-bold text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400 shrink-0" />
                      <span>{item.phone || item.contact_phone || item.email || '-'}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <span className="bg-emerald-50 text-emerald-600 font-black px-2.5 py-1 rounded-md text-[10px]">
                      เปิดรับสมัคร
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CoordinatorManagement = ({ activeTab }) => (
  <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 animate-fade-in">
    <h3 className="text-lg font-black text-gray-800 mb-2">ระบบจัดการสำหรับผู้ประสานงาน</h3>
    <p className="text-xs text-gray-500 font-medium">
      เมนูที่เลือกปัจจุบัน: <span className="text-[#800000] font-bold">{activeTab}</span>
    </p>
  </div>
);

const AdvisorManagement = ({ activeTab }) => (
  <div className="bg-white p-8 rounded-[35px] shadow-sm border border-gray-100 animate-fade-in">
    <h3 className="text-lg font-black text-gray-800 mb-2">ระบบจัดการสำหรับอาจารย์นิเทศก์</h3>
    <p className="text-xs text-gray-500 font-medium">
      เมนูที่เลือกปัจจุบัน: <span className="text-[#800000] font-bold">{activeTab}</span>
    </p>
  </div>
);

// --- 2. Main Dashboard Component ---

const MainAppContainer = ({ userRole, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [studentProfile, setStudentProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ดึงข้อมูลส่วนตัวของนักศึกษาเมื่อเข้าใช้งานในสิทธิ์ student
  useEffect(() => {
    if (userRole === 'student') {
      const fetchStudentProfile = async () => {
        setLoadingProfile(true);
        try {
          const response = await axios.get(`${API_BASE_URL}/student/me`);
          setStudentProfile(response.data);
        } catch (err) {
          console.error('Fetch student profile failed:', err);
        } finally {
          setLoadingProfile(false);
        }
      };

      fetchStudentProfile();
    }
  }, [userRole]);

  // กำหนดการแสดงชื่อและรหัสผ่านข้อมูล API หรือ Fallback
  const displayFullName = userRole === 'student'
    ? (studentProfile?.first_name ? `${studentProfile.first_name} ${studentProfile.last_name || ''}` : studentProfile?.name || 'นักศึกษา')
    : 'เจ้าหน้าที่ผู้ดูแลระบบ';

  const displayId = userRole === 'student'
    ? (studentProfile?.student_id || studentProfile?.id || '64010001')
    : 'STAFF-001';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    onLogout();
  };

  const getMenuItems = () => {
    if (userRole === 'student') {
      return [
        { id: 'overview', name: 'หน้าหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'บริษัท', icon: <Factory size={20}/> },
        { id: 'request', name: 'คำร้องของฉัน', icon: <FileSearch size={20}/> }
      ];
    } else if (userRole === 'coordinator') {
      return [
        { id: 'overview', name: 'แผงควบคุมหลัก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'จัดการบริษัท', icon: <Factory size={20}/> },
        { id: 'manage_requests', name: 'อนุมัติคำร้องนักศึกษา', icon: <ClipboardCheck size={20}/> },
        { id: 'all_students', name: 'ข้อมูลสิทธิ์และปฏิทิน', icon: <Users size={20}/> }
      ];
    } else {
      return [
        { id: 'overview', name: 'หน้าแรก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'ดูรายชื่อสถานประกอบการ', icon: <Factory size={20}/> },
        { id: 'supervise', name: 'บันทึกการนิเทศงาน', icon: <ClipboardCheck size={20}/> },
        { id: 'my_students', name: 'นักศึกษาในที่ปรึกษา', icon: <Users size={20}/> }
      ];
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 bg-[#800000] text-white transition-all duration-300 flex flex-col shrink-0 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full md:translate-x-0 md:w-24'}`}>
        <div className="p-6 flex items-center justify-center border-b border-white/10 relative h-24 shrink-0">
          <div className="flex items-center gap-3">
            <RobotLogo className="w-12 h-12 drop-shadow-md" />
            {(isSidebarOpen || window.innerWidth < 768) && (
              <span className="font-black text-base uppercase tracking-tighter text-white animate-in fade-in duration-300">
                CO-OP SYSTEM ({userRole === 'student' ? 'STUDENT' : 'STAFF'})
              </span>
            )}
          </div>
          {isSidebarOpen && (
            <button onClick={() => setIsSidebarOpen(false)} className="absolute right-4 md:hidden p-2 hover:bg-white/10 rounded-xl">
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 px-4 mt-8 space-y-2 overflow-y-auto">
          {getMenuItems().map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }} className={`flex items-center w-full p-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-white text-[#800000] shadow-lg' : 'text-red-100/70 hover:bg-white/5'}`}>
              {item.icon}
              {isSidebarOpen && <span className="ml-4 text-xs font-black uppercase tracking-wide">{item.name}</span>}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="p-8 flex items-center text-red-200 hover:text-white transition-colors border-t border-white/5 shrink-0">
          <LogOut size={20} />
          {isSidebarOpen && <span className="ml-4 font-black text-xs uppercase">LOGOUT</span>}
        </button>
      </aside>

      {/* ขอบเขตเนื้อหาหลักฝั่งขวา */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header แถบบน */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-all">
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-black text-gray-800 uppercase tracking-wide text-sm md:text-base">
              {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 pl-4 pr-3 py-1.5 rounded-2xl border border-gray-100">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-gray-700">
                {userRole === 'student' ? `ST-ID: ${displayId}` : `STAFF-ID: ${displayId}`}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-red-800 uppercase bg-red-50 px-1.5 py-0.5 rounded">
                  {userRole === 'student' ? 'นักศึกษา' : userRole === 'coordinator' ? 'ผู้ประสานงาน' : 'อาจารย์นิเทศก์'}
                </span>
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
                {/* 1. ส่วนต้อนรับและข้อมูลส่วนตัวตามบทบาท */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* แบนเนอร์แดงต้อนรับ */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-black mb-2">
                      สวัสดีคุณ {displayFullName}!
                    </h3>
                    <p className="opacity-80 text-xs font-medium max-w-sm leading-relaxed">
                      {userRole === 'student'
                        ? 'ยินดีต้อนรับเข้าสู่ระบบจัดการสหกิจศึกษา ตรวจสอบสถานะคำร้องและข้อมูลบริษัทชั้นนำได้ทันที'
                        : 'ระบบจัดการหลังบ้านสำหรับคณาจารย์และเจ้าหน้าที่ ตรวจสอบความถูกต้องและอนุมัติสิทธิ์นักศึกษา'}
                    </p>
                    <Factory className="absolute -right-6 -bottom-10 w-48 h-48 text-white/5 rotate-12 pointer-events-none" />
                  </div>

                  {/* การ์ดข้อมูลส่วนตัวผู้ใช้งาน (ดึงข้อมูลจริงจาก API /student/me) */}
                  <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-red-50 text-[#800000] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        บัญชีผู้ใช้งานปัจจุบัน
                      </span>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500"><GraduationCap size={24} /></div>
                        <div>
                          <p className="text-xs font-black text-gray-800">{displayFullName}</p>
                          <p className="text-[11px] text-gray-400 font-bold">สิทธิ์ใช้งาน: {userRole}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-50 pt-3 mt-4 space-y-1.5 text-xs text-gray-500 font-bold">
                      {userRole === 'student' ? (
                        loadingProfile ? (
                          <p className="text-gray-400 text-[10px]">กำลังโหลดข้อมูล...</p>
                        ) : (
                          <>
                            <p>คณะ: <span className="text-gray-700 font-black">{studentProfile?.faculty || 'วิศวกรรมศาสตร์'}</span></p>
                            <p>สาขา: <span className="text-gray-700 font-black">{studentProfile?.major || studentProfile?.department || 'วิศวกรรมคอมพิวเตอร์'}</span></p>
                            <p>GPAX: <span className="text-[#800000] font-black">{studentProfile?.gpax || studentProfile?.gpa || '-'}</span></p>
                          </>
                        )
                      ) : (
                        <>
                          <p>สังกัด: <span className="text-gray-700 font-black">เจ้าหน้าที่ผู้ดูแลระบบสหกิจศึกษา</span></p>
                          <p>สถานะการตรวจสอบ: <span className="text-green-600 font-black">Authorized Staff</span></p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. สรุปแดชบอร์ดตามบทบาทผู้ใช้งาน */}
                <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                  <h4 className="text-gray-800 font-black mb-6 flex items-center gap-2">
                    <BarChart3 size={20} className="text-[#800000]"/>
                    {userRole === 'student' ? 'สรุปสถานะคำร้องส่วนตัว' : 'ภาพรวมข้อมูลคำร้องงานในระบบทั้งหมด'}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-emerald-600 mb-1">อนุมัติเรียบร้อย</p>
                        <h5 className="text-2xl font-black text-emerald-700">{userRole === 'student' ? '1' : '45'} <span className="text-xs font-bold text-emerald-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-emerald-700 shadow-sm border-2 border-emerald-400">OK</div>
                    </div>

                    <div className="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-amber-600 mb-1">รอการตรวจสอบ</p>
                        <h5 className="text-2xl font-black text-amber-700">{userRole === 'student' ? '1' : '12'} <span className="text-xs font-bold text-amber-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-amber-700 shadow-sm border-2 border-amber-300">WAIT</div>
                    </div>

                    <div className="p-5 bg-red-50/40 border border-red-100 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-red-600 mb-1">ปฏิเสธ/รอแก้ไข</p>
                        <h5 className="text-2xl font-black text-red-700">0 <span className="text-xs font-bold text-red-600/70">รายการ</span></h5>
                      </div>
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xs font-black text-gray-400 shadow-sm border-2 border-gray-200">0</div>
                    </div>
                  </div>
                </div>

                {/* ไทม์ไลน์จะแสดงเฉพาะฝั่งนักศึกษา */}
                {userRole === 'student' && (
                  <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                    <h4 className="text-gray-800 font-black mb-8 flex items-center gap-2">
                      <Calendar size={20} className="text-[#800000]"/> ไทม์ไลน์ขั้นตอนการดำเนินงาน (Co-op Timeline)
                    </h4>
                    <div className="relative border-l-2 border-red-100 ml-4 md:ml-6 space-y-8 pb-4">
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white p-1 rounded-full">
                          <CheckCircle2 size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">เสร็จสิ้นแล้ว</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">ยื่นใบสมัครและเลือกสถานประกอบการ</h5>
                        </div>
                      </div>
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-amber-400 text-white p-1 rounded-full">
                          <Clock size={16} />
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-600 font-black bg-amber-50 px-2 py-0.5 rounded-md">กำลังดำเนินงาน</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">อาจารย์และเจ้าหน้าที่ตรวจสอบคำร้อง</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'company' && <CompanyManagement />}

            {/* หน้าสลับสำหรับฝั่ง ผู้ประสานงาน */}
            {userRole === 'coordinator' && (
              <CoordinatorManagement activeTab={activeTab} />
            )}

            {/* หน้าสลับสำหรับฝั่ง อาจารย์นิเทศก์ */}
            {userRole === 'advisor' && (
              <AdvisorManagement activeTab={activeTab} />
            )}

            {/* Fallback View สำหรับหน้าคำร้องฝั่งนักศึกษา */}
            {userRole === 'student' && activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100 animate-fade-in">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">หน้าต่างตรวจสอบคำร้องนักศึกษา</h3>
                <p className="text-xs text-gray-400 font-bold mt-2">คำร้องของคุณกำลังอยู่ในกระบวนการพิจารณาตรวจสอบความถูกต้องโครงสร้างขององค์กร</p>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
};

// --- 3. Login Page Component ---

const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('student'); // 'student' | 'coordinator' | 'advisor'
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
      
      const endpoint = '/login'; 
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
      
      const token = typeof response.data === 'string' ? response.data : (response.data.access_token || response.data.token);
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        onLogin(role);
      } else {
        alert("ระบบได้รับข้อมูลสำเร็จ แต่ไม่พบสิทธิ์เข้าใช้งานในรูปแบบ Token");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          alert(`ไม่พบหน้าปลายทาง (404 Not Found):\nพาท "${error.config.url}" ไม่มีอยู่จริงในเซิร์ฟเวอร์หลังบ้าน`);
        } else if (error.response.status === 401 || error.response.status === 422) {
          alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือโครงสร้างข้อมูลไม่สมบูรณ์");
        } else {
          alert(`เกิดข้อผิดพลาดจากเซิร์ฟเวอร์: รหัสสถานะ ${error.response.status}`);
        }
      } else {
        alert("ไม่สามารถเชื่อมต่อเครือข่ายเข้ากับเซิร์ฟเวอร์หลังบ้านได้");
      }
    } finally {
      setLoading(false);
    }
  };

  const getUsernamePlaceholder = () => {
    if (role === 'student') return "รหัสนักศึกษา";
    if (role === 'coordinator') return "ชื่อบัญชีอาจารย์ผู้ประสานงาน";
    return "ชื่อบัญชีอาจารย์นิเทศก์";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl w-full max-w-lg border border-gray-50 text-center">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <RobotLogo className="w-18 h-18" />
        </div>
        <h1 className="text-xl font-black text-gray-800 uppercase mb-6 tracking-tighter">เข้าสู่ระบบระบบสหกิจศึกษา</h1>
        
        <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1.5 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => { setRole('student'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'student' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            นักศึกษา
          </button>
          <button
            type="button"
            onClick={() => { setRole('coordinator'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'coordinator' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            ผู้ประสานงาน
          </button>
          <button
            type="button"
            onClick={() => { setRole('advisor'); setUsername(''); setPassword(''); }}
            className={`py-2.5 rounded-xl font-black text-xs transition-all ${role === 'advisor' ? 'bg-[#800000] text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
          >
            อาจารย์นิเทศก์
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">ชื่อบัญชีผู้ใช้งาน</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all text-sm"
              placeholder={getUsernamePlaceholder()}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">รหัสผ่านสำหรับเข้าสู่ระบบ</label>
            <input
              type="password"
              className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold focus:border-[#800000] transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white py-4 mt-2 rounded-2xl font-black shadow-xl hover:bg-black transition-all text-sm tracking-wider">
            {loading ? 'กำลังเข้าสู่ระบบ...' : `เข้าสู่ระบบในฐานะ${role === 'student' ? 'นักศึกษา' : role === 'coordinator' ? 'ผู้ประสานงาน' : 'อาจารย์นิเทศก์'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 4. Main App Controller ---

export default function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');
    if (savedRole && token) {
      setUserRole(savedRole);
    }
  }, []);

  const handleLogin = (role) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <>
      {userRole ? (
        <MainAppContainer userRole={userRole} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}