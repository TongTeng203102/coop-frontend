import React, { useState, useEffect } from 'react';
import api from './api.js'; // นำเข้าจากไฟล์ api.js ที่อยู่ข้างกันในโฟลเดอร์ src

// สไตล์ CSS แบบกำหนดเอง (ปรับฟอนต์ให้เข้ากับสารบรรณและหน้าตาดูทันสมัยขึ้น)
const styles = {
  container: { 
    fontFamily: "'Sarabun', sans-serif", 
    maxWidth: '1000px', 
    margin: '0 auto', 
    padding: '30px 20px' 
  },
  tabContainer: { 
    display: 'flex', 
    gap: '12px', 
    marginBottom: '25px', 
    borderBottom: '1px solid #e2e8f0', 
    paddingBottom: '15px' 
  },
  button: { 
    padding: '10px 20px', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontWeight: '600',
    fontFamily: "'Sarabun', sans-serif",
    transition: 'all 0.2s ease-in-out'
  },
  activeBtn: { 
    backgroundColor: '#3f51b5', 
    color: '#fff',
    boxShadow: '0 4px 6px -1px rgba(63, 81, 181, 0.2)'
  },
  inactiveBtn: { 
    backgroundColor: '#f1f5f9', 
    color: '#475569' 
  },
  table: { 
    width: '100%', 
    borderCollapse: 'collapse', 
    textAlign: 'left', 
    marginTop: '15px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  th: { 
    borderBottom: '2px solid #e2e8f0', 
    padding: '16px', 
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontWeight: '600'
  },
  td: { 
    borderBottom: '1px solid #f1f5f9', 
    padding: '16px',
    color: '#475569'
  },
  card: { 
    border: '1px solid #e2e8f0', 
    borderRadius: '12px', 
    padding: '24px', 
    maxWidth: '450px', 
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', 
    marginTop: '15px',
    backgroundColor: '#ffffff'
  },
  avatar: { 
    width: '60px', 
    height: '60px', 
    borderRadius: '50%', 
    backgroundColor: '#3f51b5', 
    color: '#fff', 
    display: 'flex', 
    alignItems: 'center', 
    justify: 'center', 
    fontSize: '24px', 
    fontWeight: 'bold', 
    marginRight: '20px' 
  },
  badge: { 
    padding: '6px 12px', 
    borderRadius: '9999px', 
    fontSize: '13px', 
    fontWeight: '600' 
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('teacher'); // 'teacher' หรือ 'student'

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#1e293b', marginBottom: '8px', fontWeight: '700' }}>ระบบบริหารงานสหกิจศึกษา</h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>มหาวิทยาลัยเทคโนโลยีและนวัตกรรม</p>
      
      {/* ส่วนเลือกเปลี่ยนสลับระหว่างสองมุมมอง */}
      <div style={styles.tabContainer}>
        <button 
          style={{...styles.button, ...(activeTab === 'teacher' ? styles.activeBtn : styles.inactiveBtn)}}
          onClick={() => setActiveTab('teacher')}
        >
          มุมมองของอาจารย์ (ดูนักศึกษา)
        </button>
        <button 
          style={{...styles.button, ...(activeTab === 'student' ? styles.activeBtn : styles.inactiveBtn)}}
          onClick={() => setActiveTab('student')}
        >
          มุมมองของนักศึกษา (ดูอาจารย์)
        </button>
      </div>

      {/* Render Component ตามแท็บที่ถูกเลือก */}
      {activeTab === 'teacher' ? <TeacherStudentsView /> : <StudentTeacherView />}
    </div>
  );
}

// ==========================================
// Component A: มุมมองอาจารย์ ดูนักศึกษาที่ดูแล
// ==========================================
function TeacherStudentsView() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/teacher/students');
        setStudents(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถเชื่อมต่อข้อมูลนักศึกษาที่ดูแลได้ (หากยังไม่ล็อกอินกรุณาตรวจสอบ Token ใน LocalStorage)');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div style={{ color: '#64748b' }}>กำลังดึงข้อมูลนักศึกษาที่อยู่ในความดูแลของคุณ...</div>;
  if (error) return <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fee2e2' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ color: '#1e293b', fontSize: '20px', marginBottom: '16px' }}>รายชื่อนักศึกษาที่ดูแล</h2>
      {students.length === 0 ? (
        <p style={{ color: '#64748b' }}>ไม่มีข้อมูลนักศึกษาในความดูแลของคุณในขณะนี้</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>รหัสนักศึกษา</th>
              <th style={styles.th}>ชื่อ-นามสกุล</th>
              <th style={styles.th}>สาขาวิชา</th>
              <th style={styles.th}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td style={styles.td}>{student.studentId || student.id}</td>
                <td style={styles.td}>{student.name}</td>
                <td style={styles.td}>{student.department || 'ไม่ระบุสาขา'}</td>
                <td style={styles.td}>
                  <span style={{ 
                    ...styles.badge, 
                    backgroundColor: student.status === 'approved' ? '#dcfce7' : '#fee2e2',
                    color: student.status === 'approved' ? '#15803d' : '#b91c1c'
                  }}>
                    {student.status === 'approved' ? 'อนุมัติแล้ว' : student.status || 'รอดำเนินการ'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ==========================================
// Component B: มุมมองนักศึกษา ดูอาจารย์ที่ดูแล
// ==========================================
function StudentTeacherView() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        const response = await api.get('/student/teacher');
        setTeacher(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถดึงข้อมูลอาจารย์ที่ดูแลได้ (รหัสผ่านหรือสถานะอาจจะไม่ถูกต้อง)');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);

  if (loading) return <div style={{ color: '#64748b' }}>กำลังค้นหาข้อมูลอาจารย์ที่ปรึกษา...</div>;
  if (error) return <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '16px', borderRadius: '8px', border: '1px solid #fee2e2' }}>{error}</div>;
  if (!teacher) return <p style={{ color: '#64748b' }}>ไม่พบข้อมูลอาจารย์ที่ดูแลในขณะนี้</p>;

  return (
    <div>
      <h2 style={{ color: '#1e293b', fontSize: '20px', marginBottom: '16px' }}>อาจารย์ผู้ดูแลงานสหกิจศึกษาของคุณ</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={styles.avatar}>
            {teacher.name ? teacher.name.charAt(0) : 'T'}
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>{teacher.name}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              {teacher.academicPosition || 'อาจารย์นิเทศ'}
            </p>
          </div>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '15px 0' }} />
        
        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.8' }}>
          <div><strong>อีเมล:</strong> {teacher.email || 'ไม่มีระบุ'}</div>
          <div><strong>เบอร์โทรศัพท์:</strong> {teacher.phone || 'ไม่มีระบุ'}</div>
          <div><strong>ห้องทำงาน:</strong> {teacher.office || 'ไม่มีระบุ'}</div>
        </div>
      </div>
    </div>
  );
}