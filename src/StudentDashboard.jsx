import React, { useState } from 'react';
import { 
  User, 
  Shield, 
  GraduationCap, 
  LayoutDashboard, 
  Building2, 
  FileText, 
  Users, 
  ClipboardCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileSearch, 
  ShieldAlert, 
  LogOut,
  ChevronRight,
  Lock
} from 'lucide-react';

// ==========================================
// 1. Mockup Component: ระบบจัดการสถานประกอบการ (Company Management)
// ==========================================
const CompanyManagement = () => {
  const [companies] = useState([
    { id: 1, name: 'บริษัท นวัตกรรมเทคโนโลยี จำกัด', zone: 'กรุงเทพมหานคร', role: 'Software Engineer / AI', pay: '400/วัน' },
    { id: 2, name: 'บริษัท เอไอ โซลูชัน แอนด์ รีเสิร์ช', zone: 'กรุงเทพมหานคร', role: 'Data Analysis / AI', pay: '10,000/เดือน' },
    { id: 3, name: 'บริษัท ปูนซิเมนต์ไทย (ทุ่งสง) จำกัด', zone: 'นครศรีธรรมราช', role: 'Frontend + AI', pay: '500/วัน' },
    { id: 4, name: 'National Chung Cheng University', zone: 'Taiwan', role: 'AI / Data Science Research', pay: '2,000 TWD/เดือน' }
  ]);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
            <Building2 size={24} /> ข้อมูลสถานประกอบการสหกิจศึกษา
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">
            รายชื่อบริษัทและองค์กรพันธมิตรที่เข้าร่วมโครงการปีการศึกษา 2569
          </p>
        </div>
        <button className="bg-[#800000] text-white font-black text-xs px-5 py-2.5 rounded-xl hover:bg-red-900 transition-colors shadow-sm self-start md:self-center">
          + เพิ่มสถานประกอบการ
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider">
              <th className="pb-3 pl-4">ชื่อสถานประกอบการ</th>
              <th className="pb-3">จังหวัด/ประเทศ</th>
              <th className="pb-3">สายงานที่รับ</th>
              <th className="pb-3">ค่าตอบแทน/เบี้ยเลี้ยง</th>
              <th className="pb-3 pr-4 text-right">รายละเอียด</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 pl-4 font-black text-gray-800">{company.name}</td>
                <td className="py-4 text-gray-500">{company.zone}</td>
                <td className="py-4"><span className="px-2 py-1 bg-red-50 text-[#800000] rounded-md text-[10px] font-bold">{company.role}</span></td>
                <td className="py-4 text-emerald-600 font-black">{company.pay}</td>
                <td className="py-4 pr-4 text-right">
                  <button className="text-gray-400 hover:text-[#800000] transition-colors">
                    <ChevronRight size={18} className="inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 2. Main Container Component (รวมหน้า Login + หน้าแดชบอร์ดควบคุมสิทธิ์)
// ==========================================
const MainAppContainer = () => {
  // สถานะล็อกอินและตัวจำลองจัดตำแหน่งเมนูสิทธิ์
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('student');
  const [activeTab, setActiveTab] = useState('dashboard');

  // ควบคุม State ภายในฟอร์มล็อกอิน
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // คลังข้อมูลจำลองผู้ใช้งานจริงประจำโปรเจกต์สาขาวิชา
  const profileInfo = {
    student: { name: 'เตวิส วาทะสุนทรพงศ์', id: '65133654', dept: 'วิศวกรรมคอมพิวเตอร์และ AI' },
    coordinator: { name: 'คุณมัลลิกา (mallika.kl)', id: 'Staff-CE01', dept: 'ผู้ประสานงานสหกิจศึกษา' },
    advisor: { name: 'ดร.อัศนชัย สุกเกื้อ', id: 'Faculty-AI02', dept: 'อาจารย์ประจำสาขาวิชา คอมพิวเตอร์ และ AI' }
  };

  // ฟังก์ชันสแกนและตรวจสอบเพื่ออนุญาตสิทธิ์เข้าใช้งานระบบ
  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setLoginError('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน');
      return;
    }

    // 👨‍🏫 1. ตรวจสอบสิทธิ์บัญชีอาจารย์นิเทศก์ ตามออบเจกต์ข้อมูลที่คุณกำหนดล่าสุด
    if (username === 'arsancahi.su' && password === 'arsancahi.su') {
      setUserRole('advisor');
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setLoginError('');
    } 
    // 🏢 2. ตรวจสอบสิทธิ์บัญชีผู้ประสานงานโครงงาน
    else if (username === 'mallika.kl' && password === 'mallika.kl') {
      setUserRole('coordinator');
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setLoginError('');
    }
    // 👨‍🎓 3. ตรวจสอบสิทธิ์บัญชีนักศึกษาฝึกงานทั่วไป
    else if (username === 'student' && password === '1234') {
      setUserRole('student');
      setIsLoggedIn(true);
      setActiveTab('dashboard');
      setLoginError('');
    }
    else {
      setLoginError('ไม่พบบัญชีผู้ใช้งานในระบบ หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  // ฟังก์ชันสำหรับเรียกเคลียร์ Session ออกจากระบบหน้าบ้าน
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // ========================================================
  // RENDER 1: ส่วนหน้าต่างเข้าสู่ระบบ (Login Page ธีมสีเลือดหมู #800000)
  // ========================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col">
          
          {/* โลโก้แบรนด์ระบบหน้าบ้าน */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#800000] rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mx-auto mb-4">
              WU
            </div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">ระบบจัดการสหกิจศึกษา</h1>
            <p className="text-xs font-bold text-gray-400 mt-1">วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์</p>
          </div>

          {/* แบบฟอร์มรับอินพุต */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Username / บัญชีผู้ใช้</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อบัญชีผู้ใช้ของคุณ" 
                  className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-200 focus:bg-white transition-all pl-10"
                />
                <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Password / รหัสผ่าน</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl px-4 py-3 text-xs font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-red-200 focus:bg-white transition-all pl-10"
                />
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
              </div>
            </div>

            {/* พ่นบล็อก Alert เมื่อกรอกรหัสผิดพลาด */}
            {loginError && (
              <p className="text-[11px] font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">{loginError}</p>
            )}

            <button type="submit" className="w-full bg-[#800000] text-white py-3.5 rounded-2xl font-black text-xs hover:bg-red-900 transition-all shadow-sm">
              เข้าสู่ระบบปลอดภัย
            </button>
          </form>

          {/* รายการบัญชีผู้ใช้ที่แนะนำสำหรับใช้ตรวจสอบและทดสอบสิทธิ์ */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-[10px] font-bold text-gray-400 space-y-2">
            <p className="text-center">💡 บัญชีทดสอบระบบแยกตามสิทธิ์การใช้งาน (Roles):</p>
            <div className="grid grid-cols-1 gap-1 pl-2 text-gray-500">
              <p>• 👨‍🏫 อาจารย์นิเทศก์: <span className="text-[#800000] font-black">arsancahi.su</span> / <span className="text-[#800000] font-black">arsancahi.su</span></p>
              <p>• 🏢 ผู้ประสานงาน: <span className="text-[#800000] font-black">mallika.kl</span> / <span className="text-[#800000] font-black">mallika.kl</span></p>
              <p>• 👨‍🎓 นักศึกษา: <span className="text-gray-700 font-black">student</span> / <span className="text-gray-700 font-black">1234</span></p>
            </div>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;800&display=swap'); body { font-family: 'Sarabun', sans-serif; }` }} />
      </div>
    );
  }

  // ========================================================
  // RENDER 2: ส่วนจัดการแผงฟังก์ชันหลักภายใน (Main App Dashboard Workspace)
  // ========================================================
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col antialiased selection:bg-red-200">
      <main className="flex-1 flex flex-col md:flex-row">
        
        {/* 🗺️ แผงเมนูด้านซ้าย (Sidebar Navigation) */}
        <aside className="w-full md:w-64 bg-white border-r border-gray-100 flex flex-col justify-between shrink-0">
          <div className="p-6">
            
            {/* โลโก้แถบเมนูด้านข้าง */}
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-50">
              <div className="w-9 h-9 bg-[#800000] rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
                WU
              </div>
              <div>
                <h1 className="text-sm font-black text-gray-800 tracking-tight leading-none">ระบบจัดการสหกิจศึกษา</h1>
                <span className="text-[10px] text-gray-400 font-bold mt-1 block">สถาบันสหกิจศึกษา มล.</span>
              </div>
            </div>

            {/* การ์ดแแสดงโปรไฟล์ที่เปลี่ยนแปลตาม Role ที่ผ่านการตรวจจับตรวจสอบสิทธิ์ */}
            <div className="bg-gray-50/80 p-4 rounded-2xl mb-6 border border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white rounded-xl shadow-sm text-[#800000]">
                  {userRole === 'student' && <User size={18} />}
                  {userRole === 'coordinator' && <Shield size={18} />}
                  {userRole === 'advisor' && <GraduationCap size={18} />}
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xs font-black text-gray-800 truncate">{profileInfo[userRole].name}</h2>
                  <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{profileInfo[userRole].dept}</p>
                </div>
              </div>
            </div>

            {/* รายการแถบปุ่มเมนูจัดรูปแบบ Dynamic ตามผู้ใช้งาน */}
            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <LayoutDashboard size={16} /> หน้าแรก / แดชบอร์ด
              </button>

              <button 
                onClick={() => setActiveTab('company')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'company' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Building2 size={16} /> ข้อมูลสถานประกอบการ
              </button>

              {/* แท็บเฉพาะกลุ่มสิทธิ์นักศึกษา */}
              {userRole === 'student' && (
                <button 
                  onClick={() => setActiveTab('request')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'request' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <FileText size={16} /> ยื่นเอกสารคำร้องสหกิจ
                </button>
              )}

              {/* แท็บเฉพาะกลุ่มสิทธิ์ผู้ประสานงาน (mallika.kl) */}
              {userRole === 'coordinator' && (
                <>
                  <button 
                    onClick={() => setActiveTab('manage_requests')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'manage_requests' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <ClipboardCheck size={16} /> ตรวจสอบพิจารณาคำร้อง
                  </button>
                  <button 
                    onClick={() => setActiveTab('all_students')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'all_students' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Users size={16} /> รายชื่อนักศึกษาทั้งหมด
                  </button>
                </>
              )}

              {/* แท็บเฉพาะกลุ่มสิทธิ์อาจารย์นิเทศก์ (arsancahi.su) */}
              {userRole === 'advisor' && (
                <>
                  <button 
                    onClick={() => setActiveTab('supervise')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'supervise' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <ClipboardCheck size={16} /> บันทึกการนิเทศงาน
                  </button>
                  <button 
                    onClick={() => setActiveTab('my_students')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'my_students' ? 'bg-red-50 text-[#800000]' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <Users size={16} /> นักศึกษาในความดูแล
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* แถบส่วนท้ายเมนูสำหรับ Logout ล้างสถานะ */}
          <div className="p-6 border-t border-gray-50">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-black text-gray-400 hover:text-red-600 rounded-xl hover:bg-red-50/50 transition-all">
              <LogOut size={16} /> ออกจากระบบคลาวด์
            </button>
          </div>
        </aside>

        {/* 🏢 พื้นที่หลักของ Workspace แสดงเนื้อหาตามป้ายสลับเงื่อนไขแท็บ */}
        <section className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* ========================================================
                แท็บ: หน้าแรก / แดชบอร์ด (Dashboard Tab)
               ======================================================== */}
            {activeTab === 'dashboard' && (
              <>
                <div className="bg-[#800000] text-white p-6 md:p-8 rounded-[35px] shadow-sm relative overflow-hidden">
                  <div className="relative z-10 max-w-md">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      Cooperative Management Platform
                    </span>
                    <h2 className="text-xl md:text-2xl font-black mt-3">สวัสดีครับ, {profileInfo[userRole].name}</h2>
                    <p className="text-xs text-red-100/80 font-medium mt-1">
                      ยินดีต้อนรับเข้าสู่ระบบจัดการข้อมูลสหกิจศึกษาอัจฉริยะ สาขาวิชาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์
                    </p>
                  </div>
                </div>

                {/* แผงรวมข้อมูลย่อสามช่อง (Summary Box) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] text-gray-400 font-black uppercase">สถานะภาพรวมระบบ</span>
                    <h3 className="text-lg font-black text-gray-800 mt-1">เปิดระบบทำงานปกติ</h3>
                    <p className="text-xs text-emerald-600 font-bold mt-2">● ระบบเสถียรพร้อมเชื่อมต่อข้อมูล</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] text-gray-400 font-black uppercase">ปีการศึกษาปัจจุบัน</span>
                    <h3 className="text-lg font-black text-[#800000] mt-1">ภาคการศึกษาที่ 1/2569</h3>
                    <p className="text-xs text-gray-400 font-bold mt-2">กลุ่มวิชาเลือกเสรีวิชาชีพ</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <span className="text-[10px] text-gray-400 font-black uppercase">สิทธิ์การใช้งานเข้าถึง</span>
                    <h3 className="text-lg font-black text-gray-800 mt-1 uppercase">
                      {userRole === 'student' && 'Student'}
                      {userRole === 'coordinator' && 'Coordinator / Staff'}
                      {userRole === 'advisor' && 'Faculty / Advisor'}
                    </h3>
                    <p className="text-xs text-[#800000] font-bold mt-2">รหัสประจำตัว: {profileInfo[userRole].id}</p>
                  </div>
                </div>

                {/* โชว์ไทม์ไลน์เฉพาะกลุ่มนักศึกษา */}
                {userRole === 'student' && (
                  <div className="bg-white p-6 md:p-8 rounded-[35px] border border-gray-100 shadow-sm">
                    <h4 className="text-gray-800 font-black mb-8 flex items-center gap-2">
                      <Calendar size={20} className="text-[#800000]"/> ไทม์ไลน์ขั้นตอนการดำเนินงาน (Co-op Timeline)
                    </h4>
                    <div className="relative border-l-2 border-red-100 ml-4 md:ml-6 space-y-8 pb-4">
                      <div className="relative pl-8">
                        <div className="absolute -left-[13px] top-0 bg-emerald-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                        <div>
                          <span className="text-[10px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">เสร็จสิ้นแล้ว</span>
                          <h5 className="text-sm font-black text-gray-800 mt-1">ยื่นใบสมัครและเลือกสถานประกอบการ</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ========================================================
                แท็บ: ข้อมูลสถานประกอบการ (Company Management Tab)
               ======================================================== */}
            {activeTab === 'company' && <CompanyManagement />}
            
            {/* ========================================================
                แท็บ: ระบบคำร้องเอกสาร (รองรับ Dynamic Table สับเปลี่ยนตาม Role)
               ======================================================== */}
            {(activeTab === 'request' || activeTab === 'manage_requests' || activeTab === 'supervise') && (
              <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
                      <ClipboardCheck size={24}/> 
                      {userRole === 'student' ? 'ประวัติคำร้องสหกิจศึกษาของฉัน' : 'ระบบบันทึกและพิจารณาคำร้องจากนักศึกษา'}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold mt-1">
                      {userRole === 'student' ? 'ติดตามสถานะการอนุมัติเอกสารและสถานที่ฝึกงาน' : 'รายการคำร้องและใบขอนิเทศงานฝึกงานของนักศึกษาในระบบ'}
                    </p>
                  </div>
                  <span className="text-[11px] bg-red-50 text-[#800000] font-black px-3 py-1 rounded-xl self-start md:self-center">
                    ปีการศึกษา 2569
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                        <th className="pb-3 pl-4">ประเภทคำร้อง/บันทึก</th>
                        <th className="pb-3">รายละเอียดนักศึกษา / สถานที่</th>
                        <th className="pb-3">วันที่ยื่นคำร้อง</th>
                        <th className="pb-3 text-center">สถานะ</th>
                        <th className="pb-3 pr-4 text-right">การพิจารณา</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                      {userRole === 'student' ? (
                        <tr className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-4 pl-4 font-black text-gray-800">แบบแจ้งแผนจัดหางาน (Co-op 01)</td>
                          <td className="py-4 text-gray-500">บริษัท นวัตกรรมเทคโนโลยี จำกัด</td>
                          <td className="py-4">01 มิ.ย. 2569</td>
                          <td className="py-4 text-center">
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">อนุมัติแล้ว</span>
                          </td>
                          <td className="py-4 pr-4 text-right">
                            <button className="text-gray-400 hover:text-gray-600">ดูเอกสาร</button>
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-4 pl-4 font-black text-[#800000]">{userRole === 'advisor' ? 'บันทึกการนิเทศงาน (ครั้งที่ 1)' : 'ใบสมัครสหกิจศึกษา'}</td>
                            <td className="py-4">
                              <p className="font-black text-gray-800">นายสมชาย สายโค้ด (66102030)</p>
                              <p className="text-[11px] text-gray-400 font-medium">บริษัท นวัตกรรมเทคโนโลยี จำกัด</p>
                            </td>
                            <td className="py-4">03 มิ.ย. 2569</td>
                            <td className="py-4 text-center">
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black">รอการตรวจประเมิน</span>
                            </td>
                            <td className="py-4 pr-4 text-right space-x-2 whitespace-nowrap">
                              <button onClick={() => alert('อนุมัติบันทึกคำร้องสำเร็จ')} className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">อนุมัติ</button>
                              <button onClick={() => alert('ปฏิเสธ/ส่งแก้ไข')} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">ส่งแก้ไข</button>
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-gray-50/50 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                  <FileSearch size={36} className="mx-auto mb-3 text-gray-300" />
                  <h4 className="font-black text-xs text-gray-700">ส่วนแสดงผลการดึงเชื่อมโยงข้อมูลสารสนเทศเอกสารแบบ Dynamic</h4>
                  <p className="text-[11px] text-gray-400 font-bold mt-1">สิทธิ์การเชื่อมต่อควบคุมความถูกต้องโครงสร้างเอกสารโดยบุคลากรวิศวกรรมคอมพิวเตอร์และ AI</p>
                </div>
              </div>
            )}

            {/* ========================================================
                แท็บ: ฐานข้อมูลรายชื่อนักศึกษา (นักศึกษาทั้งหมด / นักศึกษาในความดูแลของอาจารย์ประจำสาขา)
               ======================================================== */}
            {(activeTab === 'all_students' || activeTab === 'my_students') && (
              <div className="bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
                      <Users size={24}/> 
                      {activeTab === 'my_students' ? 'รายชื่อนักศึกษาในความดูแลการนิเทศงาน' : 'ระบบฐานข้อมูลทะเบียนนักศึกษาสหกิจศึกษาทั้งหมด'}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold mt-1">
                      {activeTab === 'my_students' ? 'รายชื่อกลุ่มนักศึกษาสหกิจศึกษาที่มี ดร.อัศนชัย เป็นอาจารย์ที่ปรึกษานิเทศ' : 'ข้อมูลนักศึกษาทั้งหมดประจำกลุ่มวิชา คอมพิวเตอร์ และ AI มหาวิทยาลัยวลัยลักษณ์'}
                    </p>
                  </div>
                  <div className="text-right text-xs text-gray-400 font-bold whitespace-nowrap">
                    จำนวนนักศึกษาในกลุ่ม: <span className="text-[#800000] font-black text-sm">{activeTab === 'my_students' ? '2' : '24'}</span> คน
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-red-50/60 p-4 rounded-xl border border-red-100 mb-6 text-xs text-[#800000] font-bold">
                  <ShieldAlert size={18} className="shrink-0" />
                  <span>มาตรการความปลอดภัย: สิทธิ์ระบบฐานข้อมูลนี้เปิดให้เข้าถึงได้เฉพาะกลุ่มเจ้าหน้าที่และคณาจารย์ผู้ประเมินผลเท่านั้น</span>
                </div>

                {/* กล่องแสดงการ์ดรายชื่อนักศึกษา (Grid Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 border border-gray-100 bg-gray-50/40 rounded-2xl flex flex-col justify-between hover:border-red-200 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0">CE</div>
                      <div>
                        <h4 className="font-black text-gray-800 text-sm">นายทศพล เจริญสุข</h4>
                        <p className="text-[11px] text-gray-400 font-bold">รหัสนักศึกษา: 66108990</p>
                        <p className="text-xs text-gray-600 font-bold mt-2">📍 ปฏิบัติงานที่: บมจ. แอดวานซ์ อินโฟร์ เซอร์วิส (AIS)</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">ผ่านการคัดเลือกแล้ว</span>
                      <button onClick={() => alert('เปิดรายละเอียดประวัติและเกณฑ์คะแนนของนักศึกษา')} className="text-xs text-[#800000] font-black hover:underline">ดูโปรไฟล์</button>
                    </div>
                  </div>

                  <div className="p-5 border border-gray-100 bg-gray-50/40 rounded-2xl flex flex-col justify-between hover:border-red-200 transition-all">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#800000] rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0">AI</div>
                      <div>
                        <h4 className="font-black text-gray-800 text-sm">นางสาวกนกวรรณ มณีรัตน์</h4>
                        <p className="text-[11px] text-gray-400 font-bold">รหัสนักศึกษา: 66104321</p>
                        <p className="text-xs text-gray-600 font-bold mt-2">📍 ปฏิบัติงานที่: ศูนย์วิจัยเทคโนโลยีปัญญาประดิษฐ์แห่งชาติ</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">ผ่านการคัดเลือกแล้ว</span>
                      <button onClick={() => alert('เปิดรายละเอียดประวัติและเกณฑ์คะแนนของนักศึกษา')} className="text-xs text-[#800000] font-black hover:underline">ดูโปรไฟล์</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>
      
      {/* ฝังฟอนต์ Sarabun เพื่อความสวยงามเป็นระเบียบตามรูปแบบดีไซน์ */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;700;800&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
      `}} />
    </div>
  );
};

export default MainAppContainer;