// src/Api/RequestApijs
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
export const getRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

export const getMaterialRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/`);
    // تحويل البيانات إلى شكل الصفحة
    const requests = response.data.results.map((req) => ({
      id: req.id,
      title: req.project_name,
      student: req.student_name,
      lab: req.project_name || 'Lab',
      date: new Date(req.created_at).toLocaleDateString(),
      status: req.status_display,
      materials: req.items.map((item) => item.material_name).join(', '),
      qr: req.validation_slip?.validation_code || 'N/A',
      returnDate: new Date(req.end_date).toLocaleDateString(),
      issuedBy: req.student_name,
      actions: getActionsForStatus(req.status),
    }));
    return requests;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};

// دالة لتحديد الأزرار حسب الحالة
const getActionsForStatus = (status) => {
  switch (status) {
    case 'approved':
      return ['Mark Ready'];
    case 'ready':
      return ['Confirm Pickup'];
    case 'collected':
      return ['Confirm Return', 'View QR Code'];
    case 'in_use':
      return ['Confirm Return'];
    case 'returned':
      return ['Complete'];
    default:
      return ['View QR Code'];
  }
};
