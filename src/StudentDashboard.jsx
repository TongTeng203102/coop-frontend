import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3, LogOut, Menu, X,
  Factory, FileSearch,
  ChevronRight, User, MapPin, Phone,
  Building2, Info, Filter,
  CheckCircle2, Clock, Calendar, GraduationCap,
  ShieldAlert, ClipboardCheck, Users, Shield, Eye, EyeOff, Download, Edit2
} from 'lucide-react';

// --- 1. ปรับปรุงการเชื่อมต่อ API (ดึง baseURL หลัก และสกัด Token) ---
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

// --- 2. หน้าแสดงผลจัดการข้อมูลสถานประกอบการ ---
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

// --- 3. ส่วนสำหรับอาจารย์ผู้ประสานงาน (Coordinator Views) + อัปเดตสิทธิ์เชื่อมต่อ API ---
const CoordinatorManagement = ({ activeTab }) => {
  const [users, setUsers] = useState([
    { id: 4, name: "สมชาย สายฟ้า", company: "CP All", status: "Wait", major: "CPE", role: "student", access: true },
    { id: 5, name: "สมหญิง มิ่งขวัญ", company: "Agoda", status: "Approved", major: "AI", role: "student", access: true },
    { id: 6, name: "ศ.ดร.สมเกียรติ รักเรียน", company: "-", status: "-", major: "CPE", role: "advisor", access: true }
  ]);

  const [events, setEvents] = useState([
    { id: 1, title: "ส่งใบสมัครเลือกสถานประกอบการ", date: "2569-07-30", type: "Calendar" },
    { id: 2, title: "วันส่งรายงานความก้าวหน้าครั้งที่ 1", date: "2569-08-15", type: "Report" }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    alert("เปลี่ยนสถานะคำร้องของนักศึกษาเรียบร้อยแล้ว");
  };

  const toggleAccess = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, access: !u.access } : u));
  };

  // ดึง API ปรับปรุงสิทธิ์บทบาท (API: /users/{id}/role)
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await api.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      alert(`อัปเดตบทบาทผู้ใช้งาน ID: ${userId} เป็น "${newRole}" ผ่านเซิร์ฟเวอร์หลังบ้านเรียบร้อยแล้ว!`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("ไม่สามารถเปลี่ยนบทบาทสิทธิ์ผู้ใช้งานได้ทางเซิร์ฟเวอร์");
    }
  };

  if (activeTab === 'manage_requests') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
            <ClipboardCheck size={24}/> จัดการและอนุมัติคำร้องเลือกสถานประกอบการ (ผู้ประสานงาน)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">รหัสนักศึกษา</th>
                  <th className="pb-3">ชื่อ-นามสกุล</th>
                  <th className="pb-3">สาขา</th>
                  <th className="pb-3">บริษัทที่ยื่นร้องขอ</th>
                  <th className="pb-3 text-center">สถานะคำร้อง</th>
                  <th className="pb-3 text-right">การจัดการจัดการ</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
                {users.filter(u => u.status !== '-').map(st => (
                  <tr key={st.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-black text-gray-500">ST{st.id}</td>
                    <td className="py-4 text-gray-800">{st.name}</td>
                    <td className="py-4"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{st.major}</span></td>
                    <td className="py-4 font-black text-[#800000]">{st.company}</td>
                    <td className="py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                        st.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        st.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                      }`}>
                        {st.status === 'Approved' ? 'อนุมัติเรียบร้อย' : st.status === 'Rejected' ? 'ปฏิเสธคำร้อง' : 'รอตรวจสอบ'}
                      </span>
                    </td>
                    <td className="py-4 text-right space-x-2">
                      <button onClick={() => handleStatusChange(st.id, 'Approved')} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-sm">อนุมัติ</button>
                      <button onClick={() => handleStatusChange(st.id, 'Rejected')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-sm">ปฏิเสธ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'all_students') {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
              <Users size={24}/> จัดการฐานข้อมูลพื้นฐาน และสิทธิ์บทบาท (User Roles API)
            </h3>
            <p className="text-xs text-gray-400 font-bold mt-1">อัปเดตบทบาทผู้ใช้งานทันทีโดยจะทำการส่ง API ไปยังเซิร์ฟเวอร์ระบบเครือข่ายหลักแบบเรียลไทม์</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-black text-gray-400 uppercase">
                  <th className="pb-3">รหัสผู้ใช้ (ID)</th>
                  <th className="pb-3">ชื่อผู้ใช้งาน</th>
                  <th className="pb-3">บทบาทระบบปัจจุบัน</th>
                  <th className="pb-3 text-center">สิทธิ์การเข้าถึงเมนู</th>
                  <th className="pb-3 text-right">สถานะระบบ</th>
                </tr>
              </thead>
              <tbody className="text-sm font-bold text-gray-700 divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="py-4 font-mono text-gray-400 text-xs">ID: {user.id}</td>
                    <td className="py-4">{user.name}</td>
                    <td className="py-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="bg-gray-50 border border-gray-100 text-xs font-black rounded-xl p-2 outline-none focus:border-[#800000] cursor-pointer"
                      >
                        <option value="student">นักศึกษา</option>
                        <option value="advisor">อาจารย์นิเทศก์</option>
                        <option value="coordinator">ผู้ประสานงาน</option>
                      </select>
                    </td>
                    <td className="py-4 text-center">
                      <button 
                        onClick={() => toggleAccess(user.id)}
                        className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full border ${
                          user.access ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}
                      >
                        {user.access ? <Eye size={12} /> : <EyeOff size={12} />}
                        {user.access ? 'เปิดการเข้าถึง' : 'ปิดกั้นระบบ'}
                      </button>
                    </td>
                    <td className="py-4 text-right">
                      <span className={`w-2.5 h-2.5 inline-block rounded-full ${user.access ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// --- 4. ส่วนสำหรับอาจารย์นิเทศก์ (Advisor Views) + ดึงข้อมูลนักศึกษาที่ดูแลผ่าน API จริง ---
const AdvisorManagement = ({ activeTab }) => {
  const [studentsInCare, setStudentsInCare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลนักศึกษาที่ดูแลจริงผ่าน API (API: /teacher/students)
  useEffect(() => {
    const fetchStudentsInCare = async () => {
      try {
        setLoading(true);
        const response = await api.get('/teacher/students');
        setStudentsInCare(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching advisor's students:", err);
        setError("ไม่สามารถดึงรายชื่อนักศึกษาจากเซิร์ฟเวอร์ระบบได้ในขณะนี้");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'supervise' || activeTab === 'my_students') {
      fetchStudentsInCare();
    }
  }, [activeTab]);

  const handleUpdateNote = (id, text) => {
    alert(`บันทึกข้อเสนอแนะและอัปเดตผลการนิเทศงานของ ID: ${id} เรียบร้อยแล้ว`);
  };

  if (loading) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-gray-100">
        <p className="text-gray-400 font-bold animate-pulse text-sm">กำลังโหลดข้อมูลนักศึกษาที่รับผิดชอบจากระบบ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-12 text-center rounded-3xl border border-gray-100">
        <ShieldAlert size={36} className="text-red-500 mx-auto mb-2" />
        <p className="text-red-500 font-black text-sm">{error}</p>
      </div>
    );
  }

  if (activeTab === 'supervise') {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="mb-6">
          <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg">
            <ClipboardCheck size={24}/> บันทึกการนิเทศงาน และตรวจรับเอกสารนักศึกษา
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1">สามารถตรวจเอกสารที่ส่งเข้ามาจากระบบ และทำการเขียนคอมเมนต์คำชี้แนะส่วนตัวได้ทันที</p>
        </div>

        <div className="space-y-6">
          {studentsInCare.length === 0 ? (
            <p className="text-gray-400 text-xs font-bold py-6 text-center">ไม่มีรายการนักศึกษาที่ส่งเอกสารรายงานหรือฝึกสหกิจศึกษาในเทอมนี้</p>
          ) : (
            studentsInCare.map(student => (
              <div key={student.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200/60 pb-4">
                  <div>
                    <h4 className="font-black text-gray-800 text-sm md:text-base">{student.name} ({student.student_id || student.id})</h4>
                    <p className="text-xs text-gray-400 font-bold mt-1">🏢 ปฏิบัติงาน ณ: <span className="text-gray-700 font-black">{student.company || "กำลังดำเนินการตรวจสอบโครงสร้างองค์กร"}</span></p>
                  </div>
                  
                  <button 
                    onClick={() => alert(`จำลองดาวน์โหลดรายงานสหกิจ ของ ${student.name}`)}
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 border border-blue-100 px-3 py-2 rounded-xl text-xs font-black hover:bg-blue-100 transition-colors self-start md:self-auto"
                  >
                    <Download size={14} /> ดาวน์โหลดรายงานที่แนบมา
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-500 block">ความคิดเห็นเพิ่มเติมของอาจารย์นิเทศก์</label>
                  <div className="flex gap-2">
                    <textarea
                      placeholder="ป้อนคำเสนอแนะในเรื่องของการฝึกงาน เล่มรายงาน หรือผลการปฏิบัติงานจริง..."
                      id={`note-${student.id}`}
                      className="w-full p-4 text-xs font-bold bg-white border border-gray-100 rounded-2xl outline-none focus:border-[#800000] min-h-[80px] transition-colors"
                    />
                    <button 
                      onClick={() => {
                        const text = document.getElementById(`note-${student.id}`).value;
                        handleUpdateNote(student.id, text);
                      }}
                      className="bg-[#800000] hover:bg-black text-white font-black text-xs px-4 rounded-2xl shadow-sm transition-all"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'my_students') {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-[#800000] font-black flex items-center gap-2 text-lg mb-6">
          <Users size={24}/> รายชื่อนักศึกษาในความดูแลรับผิดชอบทั้งหมด
        </h3>
        
        {studentsInCare.length === 0 ? (
          <p className="text-gray-400 text-xs font-bold py-10 text-center">คุณยังไม่ได้รับมอบหมายให้ดูแลรับผิดชอบดูแลนักศึกษาคนใดในขณะนี้</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentsInCare.map(student => (
              <div key={student.id} className="p-5 border border-gray-100 rounded-2xl hover:bg-red-50/20 transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-[#800000] flex items-center justify-center font-black text-xs border border-red-100">
                  CO-OP
                </div>
                <div className="space-y-1 flex-1">
                  <h4 className="font-black text-gray-800 text-sm">{student.name}</h4>
                  <p className="text-[11px] text-gray-400 font-bold">รหัส: {student.student_id || student.id}</p>
                  <div className="pt-2">
                    <span className="text-[10px] font-black bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      📍 {student.company || "กำลังประสานงานคัดสรรองค์กร"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

// --- 5. Main Dashboard Container (เชื่อมโยง API และหน้า Dashboard ของแต่ละ Role) ---
const MainAppContainer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'student');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  const [profileData, setProfileData] = useState(null);
  const [myTeacher, setMyTeacher] = useState(null); // ดึงข้อมูลอาจารย์ที่ดูแล (API สำหรับนักศึกษา)
  const [fetchingUser, setFetchingUser] = useState(false);

  // ดึงข้อมูลโปรไฟล์ผู้ใช้ + อาจารย์ผู้ดูแล (ถ้าเข้าสู่ระบบแบบนักศึกษา)
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserProfile = async () => {
        try {
          setFetchingUser(true);
          const token = localStorage.getItem('token');
          
          let fetchUrl = '/student/me';
          if (userRole === 'coordinator' || userRole === 'advisor') {
            fetchUrl = '/staff/me';
          }

          const response = await api.get(fetchUrl);
          
          if (Array.isArray(response.data)) {
            setProfileData(response.data[0]);
          } else if (response.data?.user) {
            setProfileData(Array.isArray(response.data.user) ? response.data.user[0] : response.data.user);
          } else {
            setProfileData(response.data);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          if (error.response?.status === 401) {
            handleLogout();
          }
        } finally {
          setFetchingUser(false);
        }
      };

      // ดึงข้อมูลอาจารย์ที่ดูแลเฉพาะสิทธิ์ 'student' (API: /student/teacher)
      const fetchTeacherForStudent = async () => {
        try {
          if (userRole === 'student') {
            const res = await api.get('/student/teacher');
            setMyTeacher(res.data);
          }
        } catch (err) {
          console.error("Error fetching student's teacher:", err);
          setMyTeacher(null);
        }
      };

      fetchUserProfile();
      fetchTeacherForStudent();
    }
  }, [isLoggedIn, userRole]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfileData(null);
    setMyTeacher(null);
    setUserRole('student');
    setActiveTab('overview');
  };

  const handleLoginSuccess = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const displayId = profileData?.student_id || profileData?.staff_id || profileData?.username || '-';
  const displayFullName = profileData?.first_name && profileData?.last_name
    ? `${profileData.first_name} ${profileData.last_name}`
    : fetchingUser ? 'กำลังโหลด...' : 'อาจารย์ประจำวิชา / เจ้าหน้าที่';

  if (!isLoggedIn) return <LoginPage onLogin={handleLoginSuccess} />;

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
        { id: 'all_students', name: 'สิทธิ์ระบบและปฏิทิน', icon: <Users size={20}/> }
      ];
    } else {
      return [
        { id: 'overview', name: 'หน้าแรก', icon: <BarChart3 size={20}/> },
        { id: 'company', name: 'ดูรายชื่อสถานประกอบการ', icon: <Factory size={20}/> },
        { id: 'supervise', name: 'บันทึกการนิเทศงาน', icon: <ClipboardCheck size={20}/> },
        { id: 'my_students', name: 'นักศึกษาในความดูแล', icon: <Users size={20}/> }
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
              <span className="font-black text-base uppercase tracking-tighter text-white">
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

      {/* Main Panel */}
      <main className="flex-1 flex flex-col overflow-hidden">
       
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
            <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white font-black shadow-md">
              <User size={20} />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <div className="max-w-5xl mx-auto space-y-6">
           
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* แบนเนอร์แดงต้อนรับ */}
                  <div className="lg:col-span-2 bg-gradient-to-br from-[#800000] to-red-950 p-8 md:p-10 rounded-[35px] text-white shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl font-black mb-2">
                      สวัสดีคุณ {displayFullName}!
                    </h3>
                    <p className="opacity-80 text-xs font-medium max-w-sm leading-relaxed">
                      {userRole === 'student'
                        ? 'ยินดีต้อนรับเข้าสู่ระบบตรวจสอบเอกสารและสถานะคำร้องการเลือกองค์กรเข้าฝึกสหกิจศึกษา'
                        : 'บอร์ดจัดการระบบหลักสูตรสหกิจศึกษาเพื่อคัดเลือกดูแลนักศึกษาวิชาการและองค์กรธุรกิจ'}
                    </p>
                    <Factory className="absolute -right-6 -bottom-10 w-48 h-48 text-white/5 rotate-12 pointer-events-none" />
                  </div>

                  {/* ข้อมูลส่วนตัวผู้ใช้งาน */}
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
                        <>
                          <p>คณะ: <span className="text-gray-700 font-black">{profileData?.faculty || 'วิศวกรรมศาสตร์'}</span></p>
                          <p>สาขา: <span className="text-gray-700 font-black">{profileData?.major || 'วิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์'}</span></p>
                          <p>ภาคเรียนที่: <span className="text-[#800000] font-black">{profileData?.semester || '1/2569'}</span></p>
                        </>
                      ) : (
                        <>
                          <p>สังกัดหลักสาขา: <span className="text-gray-700 font-black">CPE & AI</span></p>
                          <p>ระดับความปลอดภัย: <span className="text-green-600 font-black">ตรวจสอบแล้ว (Authorized)</span></p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. สรุปแดชบอร์ด + ข้อมูลอาจารย์ที่ดูแลของนักศึกษา (API: /student/teacher) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* แผงสถิติสรุปงาน */}
                  <div className="md:col-span-2 bg-white p-6 md:p-8 rounded-[35px] shadow-sm border border-gray-100 space-y-4">
                    <h4 className="text-gray-800 font-black flex items-center gap-2">
                      <BarChart3 size={20} className="text-[#800000]"/>
                      {userRole === 'student' ? 'สรุปผลตอบรับจากสถานประกอบการ' : 'สถิติจำนวนคำร้องทั้งหมด'}
                    </h4>
                   
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                        <p className="text-[11px] font-bold text-emerald-600">อนุมัติเรียบร้อย</p>
                        <h5 className="text-xl font-black text-emerald-700 mt-1">{userRole === 'student' ? '1' : '32'} รายการ</h5>
                      </div>
                      <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl">
                        <p className="text-[11px] font-bold text-amber-600">รอตรวจเช็คเอกสาร</p>
                        <h5 className="text-xl font-black text-amber-700 mt-1">{userRole === 'student' ? '1' : '15'} รายการ</h5>
                      </div>
                      <div className="p-4 bg-red-50/30 border border-red-100 rounded-2xl">
                        <p className="text-[11px] font-bold text-red-600">ปฏิเสธ / ส่งกลับแก้</p>
                        <h5 className="text-xl font-black text-red-700 mt-1">{userRole === 'student' ? '0' : '2'} รายการ</h5>
                      </div>
                    </div>
                  </div>

                  {/* แสดงเฉพาะฝั่งนักศึกษา: ข้อมูลอาจารย์นิเทศก์จาก API /student/teacher */}
                  {userRole === 'student' && (
                    <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex flex-col justify-between">
                      <h5 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">อาจารย์นิเทศผู้ดูแลคุณ</h5>
                      {myTeacher ? (
                        <div className="space-y-3">
                          <div>
                            <p className="font-black text-gray-800 text-sm">{myTeacher.name || "ศ.ดร.สมชาย ใจดี"}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{myTeacher.academicPosition || "อาจารย์ประจำวิชา"}</p>
                          </div>
                          <div className="text-[11px] text-gray-500 space-y-1 border-t border-gray-100 pt-2">
                            <p>✉️ {myTeacher.email || "somchai.t@university.ac.th"}</p>
                            <p>📞 {myTeacher.phone || "02-123-4567"}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-[11px] text-gray-400 font-bold">ยังไม่ได้รับมอบหมายอาจารย์นิเทศงาน</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* ไทม์ไลน์ของนักศึกษา */}
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

            {/* แสดง UI ฝั่งผู้ประสานงาน */}
            {userRole === 'coordinator' && (
              <CoordinatorManagement activeTab={activeTab} />
            )}

            {/* แสดง UI ฝั่งอาจารย์นิเทศก์ */}
            {userRole === 'advisor' && (
              <AdvisorManagement activeTab={activeTab} />
            )}

            {/* หน้าต่างจัดวางส่งเอกสาร/คำร้องของนักศึกษา (Static) */}
            {userRole === 'student' && activeTab === 'request' && (
              <div className="bg-white p-20 rounded-[40px] text-center border-2 border-dashed border-gray-100">
                <FileSearch size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="font-black text-gray-800">หน้าต่างส่งรายงานเอกสาร และตรวจสอบผลการยื่นคำร้อง</h3>
                <p className="text-xs text-gray-400 font-bold mt-2">ประวัติต่างๆ ปัจจุบันกำลังประสานงานคัดสรรองค์กรร่วมกับฐานข้อมูลส่วนกลาง</p>
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

// --- 6. หน้า Login สำหรับเชื่อมโยงพาทหลังบ้าน ---
const LoginPage = ({ onLogin }) => {
  const [role, setRole] = useState('student');
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
      const response = await api.post(endpoint, payload);
      
      const token = typeof response.data === 'string' ? response.data : response.data.access_token;
     
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        onLogin(role);
      } else {
        alert("ได้รับข้อมูลสำเร็จแต่ไม่พบคีย์ยืนยันตัวตน Token จาก API");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("ไม่สามารถเข้าสู่ระบบได้ ชื่อผู้ใช้รหัสผ่านผิด หรือไม่พบ Endpoint ในเซิร์ฟเวอร์หลัก");
    } finally {
      setLoading(false);
    }
  };

  const getUsernamePlaceholder = () => {
    if (role === 'student') return "กรอกรหัสนักศึกษา";
    if (role === 'coordinator') return "กรอกชื่อบัญชีผู้ประสานงานหลักสูตร";
    return "กรอกชื่อบัญชีอาจารย์นิเทศก์";
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
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">ชื่อบัญชีผู้ใช้งาน (Username)</label>
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
            <label className="text-xs font-black text-gray-400 block mb-1.5 pl-1">รหัสผ่านบัญชีระบบ</label>
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

export default MainAppContainer;