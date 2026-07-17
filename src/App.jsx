import React, { useState, useEffect } from 'react';
import api from './api';

// สไตล์จำลองแบบรวดเร็ว (ไม่ต้องใช้ CSS เพิ่มเติม)
const styles = {
  container: { fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', padding: '20px' },
  tabContainer: { display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
  button: { padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  activeBtn: { backgroundColor: '#3f51b5', color: '#fff' },
  inactiveBtn: { backgroundColor: '#f0f0f0', color: '#333' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' },
  th: { borderBottom: '2px solid #ddd', padding: '12px', backgroundColor: '#f9f9f9' },
  td: { borderBottom: '1px solid #eee', padding: '12px' },
  card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginTop: '10px' },
  avatar: { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#3f51b5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', marginRight: '15px' },
  badge: { padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('teacher'); // 'teacher' หรือ 'student'

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#333' }}>ระบบบริหารงานสหกิจศึกษา</h1>
      
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
        // จะได้ URL: https://coop-backend-02.vercel.app/teacher/students
        const response = await api.get('/teacher/students');
        setStudents(response.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('ไม่สามารถเชื่อมต่อข้อมูลนักศึกษาที่ดูแลได้ (หากยังไม่ล็อกอินกรุณาเช็ค Token)');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>กำลังดึงข้อมูลนักศึกษาที่อยู่ในความดูแลของคุณ...</div>;
  if (error) return <div style={{ color: '#c5221f' }}>{error}</div>;

  return (
    <div>
      <h2 style={{ color: '#444' }}>รายชื่อนักศึกษาที่ดูแล</h2>
      {students.length === 0 ? (
        <p style={{ color: '#666' }}>ไม่มีข้อมูลนักศึกษาในความดูแลของคุณในขณะนี้</p>
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
                    backgroundColor: student.status === 'approved' ? '#e6f4ea' : '#fce8e6',
                    color: student.status === 'approved' ? '#137333' : '#c5221f'
                  }}>
                    {student.status || 'รอดำเนินการ'}
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
        // จะได้ URL: https://coop-backend-02.vercel.app/student/teacher
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

  if (loading) return <div>กำลังค้นหาข้อมูลอาจารย์ที่ปรึกษา...</div>;
  if (error) return <div style={{ color: '#c5221f' }}>{error}</div>;
  if (!teacher) return <p>ไม่พบข้อมูลอาจารย์ที่ดูแลในขณะนี้</p>;

  return (
    <div>
      <h2 style={{ color: '#444' }}>อาจารย์ผู้ดูแลงานสหกิจศึกษาของคุณ</h2>
      
      <div style={styles.card}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <div style={styles.avatar}>
            {teacher.name ? teacher.name.charAt(0) : 'T'}
          </div>
          <div>
            <h3 style={{ margin: 0, color: '#222' }}>{teacher.name}</h3>
            <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>
              {teacher.academicPosition || 'อาจารย์นิเทศ'}
            </p>
          </div>
        </div>
        
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />
        
        <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
          <div><strong>อีเมล:</strong> {teacher.email || 'ไม่มีระบุ'}</div>
          <div><strong>เบอร์โทรศัพท์:</strong> {teacher.phone || 'ไม่มีระบุ'}</div>
          <div><strong>ห้องทำงาน:</strong> {teacher.office || 'ไม่มีระบุ'}</div>
        </div>
      </div>
    </div>
  );
}