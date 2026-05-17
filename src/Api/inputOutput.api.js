// src/Api/inputOutput.api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api'; // ✅ الـ Backend الرئيسي

export const fetchOutputs = async (filters = {}) => {
  try {
    // ✅ استعمال endpoint المواد المخرجة
    const res = await axios.get(`${API_BASE}/material-outputs/`, { params: filters });
    // تحويل البيانات إلى شكل الصفحة
    const outputs = res.data.results.map((item) => ({
      id: item.id,
      material: item.material_name,
      desc: `${item.material_category || 'Equipment'} • Qty: ${item.quantity}`,
      lab: item.laboratory_name,
      student: item.student_name,
      issued: `${item.issued_date} ${item.issued_by || 'Admin'}`,
      returned: item.actual_return_date
        ? new Date(item.actual_return_date).toLocaleDateString('fr-FR')
        : 'Not returned',
      condition: item.condition || 'Good',
      status: item.status,
    }));
    return outputs;
  } catch (error) {
    console.warn('Server error, using mock data:', error);
    return mockOutputs;
  }
};

export const fetchStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/material-outputs/stats/`);
    return res.data;
  } catch (error) {
    console.warn('Stats server error, using mock:', error);
    return { total: 0, borrowed: 0, returned: 0, overdue: 0, transferred: 0 };
  }
};

// Mock data backup
const mockOutputs = [
  {
    id: 1,
    material: 'Arduino Uno R3',
    desc: 'Microcontrollers • Qty: 3',
    lab: 'Lab A - Electronics',
    student: 'Sarah Student • IoT Weather Station',
    issued: '2026-03-18 • John Keeper',
    returned: new Date().toLocaleDateString('fr-FR'),
    condition: 'Excellent',
    status: 'Borrowed',
  },
  // ... add more mock data
];
