import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Building2, FileEdit, LogOut, Menu, X, Lock, User, 
  UserCog, Factory, FileSearch, PlusCircle, CheckSquare, 
  CalendarDays, Mail, PieChart, Search, ChevronRight, AlertCircle
} from 'lucide-react';

// --- Configuration ---
const API_BASE_URL = "https://coop-backend-02.vercel.app";

const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- 1. Sub-Components ---

// 1. ระบบจัดการข้อมูลนักศึกษา (ปรับปรุงให้ตรงกับโครงสร้างข้อมูลที่คุณระบุ)
const StudentManagement = ({ user, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    student_id: user?.student_id || '',
    faculty: user?.faculty || '',
    major: user?.major || '',
    semester: user?.semester || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        student_id: user.student_id,
        faculty: user.faculty,
        major: user.major,
        semester: user.semester,
        phone: user.phone
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ส่งข้อมูลกลับไปอัปเดตที่ Backend
      await api.put('/student/update', formData);
      alert('บันทึกข้อมูลนักศึกษาสำเร็จ');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      console.error('Update profile error:', error);
      alert('ไม่สามารถบันทึกข้อมูลได้');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left">
      <h3 className="text-[#800000] font-black mb-6 flex items-center gap-2 text-lg">
        <UserCog size={24}/> จัดการข้อมูลนักศึกษา
      </h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ชื่อจริง (First Name)</label>
          <input type="text" name="first_name" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm" value={formData.first_name} onChange={handleInputChange} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">นามสกุล (Last Name)</label>
          <input type="text" name="last_name" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm" value={formData.last_name} onChange={handleInputChange} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">รหัสนักศึกษา</label>
          <input type="text" name="student_id" className="w-full p-3 bg-gray-100 border border-gray-100 rounded-xl font-bold text-sm text-gray-500" value={formData.student_id} disabled />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">เบอร์โทรศัพท์ (Phone)</label>
          <input type="text" name="phone" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm" value={formData.phone} onChange={handleInputChange} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">คณะ (Faculty)</label>
          <input type="text" name="faculty" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm" value={formData.faculty} onChange={handleInputChange} />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">สาขาวิชา (Major)</label>
          <input type="text" name="major" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm" value={formData.major} onChange={handleInputChange} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ภาคเรียนที่ออกปฏิบัติงาน (Semester)</label>
          <input type="text" name="semester" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-sm" value={formData.semester} onChange={handleInputChange} />
        </div>
        <button type="submit" className="md:col-span-2 bg-[#800000] text-white py-4 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg shadow-red-100">
          บันทึกการเปลี่ยนแปลง
        </button>
      </form>
    </div>
  );
};

// 2. ระบบจัดการข้อมูลสถานประกอบการ
const CompanyManagement = () => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-left">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg"><Factory size={24}/> ข้อมูลสถานประกอบการ</h3>
        <p className="text-gray-400 text-xs mt-1">รายชื่อบริษัทที่ผ่านการคัดเลือกและพร้อมรับนักศึกษา</p>
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-3 text-gray-300" size={18}/>
        <input type="text" placeholder="ค้นหาบริษัท..." className="pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm w-full outline-none"/>
      </div>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-5 border border-gray-50 rounded-2xl hover:border-red-100 hover:bg-red-50/10 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-[#800000] font-black">C1</div>
          <div>
            <p className="font-black text-gray-800">บริษัท โค้ดดิ้ง เทค จำกัด</p>
            <p className="text-xs text-gray-400 font-bold uppercase">ตำแหน่ง: Software Engineer</p>
          </div>
        </div>
        <button className="p-2 text-gray-300 hover:text-[#800000]"><ChevronRight /></button>
      </div>
    </div>
  </div>
);

// --- 2. Main Login Component ---
const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/student/login`, {
        student_id: String(username),
        password: String(password)
      });
      localStorage.setItem('token', response.data.token);
      onLoginSuccess(); // เรียกฟังก์ชันดึงโปรไฟล์หลังจากล็อกอินสำเร็จ
    } catch (error) {
      alert("ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบรหัสนักศึกษาและรหัสผ่าน");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] font-['Sarabun'] px-4">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-3 bg-[#800000]"></div>
        <div className="text-center mb-10">
          <div className="bg-red-50 w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="text-[#800000]" size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight">ระบบสหกิจศึกษา</h1>
          <p className="text-gray-400 text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">Student Login Portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">รหัสนักศึกษา</label>
            <input type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-sm" placeholder="65100521" value={username} onChange={(e)=>setUsername(e.target.value)} required />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-black text-gray-400 ml-2 uppercase">รหัสผ่าน</label>
            <input type="password" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-red-50 outline-none transition-all font-bold text-sm" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#800000] text-white py-5 rounded-2xl font-black shadow-xl shadow-red-100 hover:bg-black hover:shadow-none transition-all transform active:scale-95 text-sm uppercase tracking-widest">
            {loading ? 'กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 3. Main Dashboard ---
const StudentDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ฟังก์ชันดึงข้อมูลโปรไฟล์จาก /student/me
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/student/me');
      setUserData(response.data); // ข้อมูลตามโครงสร้างที่คุณต้องการจะถูกเก็บที่นี่
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Fetch profile error:", error);
      handleLogout();
    }
  };

  // เรียกใช้เมื่อโหลดคอมโพเนนต์ครั้งแรกในกรณีที่มี Token ค้างไว้แล้ว
  useEffect(() => {
    if (isLoggedIn) {
      fetchUserProfile();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (!isLoggedIn) return <LoginPage onLoginSuccess={fetchUserProfile} />;

  const menuItems = [
    { id: 'overview', title: 'หน้าหลัก / ภาพรวม', icon: <BarChart3 size={20} /> },
    { id: 'student', title: 'จัดการข้อมูลนักศึกษา', icon: <UserCog size={20} /> },
    { id: 'company', title: 'จัดการสถานประกอบการ', icon: <Factory size={20} /> },
    { id: 'request', title: 'คำร้องเลือกสถานประกอบการ', icon: <FileSearch size={20} /> },
    { id: 'new-company', title: 'เสนอสถานประกอบการใหม่', icon: <PlusCircle size={20} /> },
    { id: 'approve', title: 'ระบบอนุมัติคำร้อง', icon: <CheckSquare size={20} /> },
    { id: 'calendar', title: 'กำหนดการกิจกรรม', icon: <CalendarDays size={20} /> },
    { id: 'email', title: 'แจ้งเตือนทางอีเมล', icon: <Mail size={20} /> },
    { id: 'report', title: 'รายงานสรุปข้อมูล', icon: <PieChart size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f1f5f9] font-['Sarabun'] antialiased overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-[#800000] text-white transition-all duration-500 ease-in-out flex flex-col z-20 shadow-2xl`}>
        <div className="p-8 flex items-center justify-between border-b border-white/10">
          {isSidebarOpen && <span className="font-black text-xl tracking-tighter uppercase">CO-OP SYSTEM</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} className="mx-auto" />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-8 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full p-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-white text-[#800000] shadow-2xl shadow-black/20' 
                : 'hover:bg-white/5 text-red-100/70 hover:text-white'
              }`}
            >
              <span className={`flex-shrink-0 ${activeTab === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
              {isSidebarOpen && <span className="ml-4 text-xs font-black tracking-wide uppercase">{item.title}</span>}
            </button>
          ))}
        </nav>
        <div className="p-6">
          <button onClick={handleLogout} className="flex items-center w-full p-4 text-red-200 hover:text-white hover:bg-white/5 rounded-2xl font-black text-xs transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4 uppercase">ออกจากระบบ</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10">
          <div className="flex flex-col text-left">
            <h2 className="font-black text-gray-800 text-lg uppercase leading-none">
              {menuItems.find(i => i.id === activeTab)?.title}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">ระบบสหกิจศึกษา</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">ยินดีต้อนรับ</p>
              {/* แสดงชื่อจริงและนามสกุลที่ดึงมาจาก API */}
              <p className="text-sm font-black text-gray-800">
                {userData ? `${userData.first_name} ${userData.last_name}` : 'กำลังโหลด...'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#800000] to-red-900 flex items-center justify-center text-white font-black shadow-lg shadow-red-100">
              {userData?.first_name?.charAt(0) || 'S'}
            </div>
          </div>
        </header>

        {/* Dynamic Section */}
        <section className="flex-1 overflow-y-auto p-10 bg-gray-50/50 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="col-span-2 bg-white p-10 rounded-[35px] border border-gray-100 shadow-sm">
                  <h3 className="font-black text-xl text-gray-800 mb-6">ภาพรวมกิจกรรมของคุณ</h3>
                  
                  {/* กล่องแสดงรายละเอียดนักศึกษาแบบย่อในหน้าแรก */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase">รหัสนักศึกษา</p>
                      <p className="text-sm font-black text-gray-700">{userData?.student_id || '-'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase">สาขาวิชา</p>
                      <p className="text-sm font-black text-gray-700">{userData?.major || '-'}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><AlertCircle /></div>
                    <div>
                      <p className="font-black text-blue-900">ประกาศสำคัญ</p>
                      <p className="text-sm text-blue-700 font-bold mt-1">กรุณาตรวจสอบความถูกต้องของข้อมูลในระบบจัดการข้อมูลนักศึกษา</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#800000] p-10 rounded-[35px] shadow-2xl shadow-red-200 text-white flex flex-col justify-between">
                  <PieChart size={40} className="opacity-20" />
                  <div>
                    <p className="text-xs font-black opacity-60 uppercase tracking-[0.2em]">ภาคเรียนปฏิบัติงาน</p>
                    <p className="text-3xl font-black mt-2">เทอม {userData?.semester || '-'}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'student' && <StudentManagement user={userData} onUpdateSuccess={fetchUserProfile} />}
            {activeTab === 'company' && <CompanyManagement />}
            
            {!['overview', 'student', 'company'].includes(activeTab) && (
              <div className="bg-white p-24 rounded-[40px] border-2 border-dashed border-gray-100 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-6 rounded-[30px] mb-6 text-[#800000] shadow-inner"><Lock size={48}/></div>
                <h3 className="text-gray-800 font-black text-xl tracking-tight uppercase">ระบบ {menuItems.find(i => i.id === activeTab)?.title}</h3>
                <p className="text-gray-400 text-sm mt-3 font-bold">ส่วนงานนี้กำลังอยู่ระหว่างการพัฒนาเชื่อมต่อฐานข้อมูล</p>
                <div className="mt-8 px-6 py-2 bg-red-50 text-[#800000] text-[10px] font-black rounded-full uppercase tracking-widest italic">Under Construction</div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;