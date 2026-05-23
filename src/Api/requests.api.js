import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

// ✅ دالة لجلب الـ Token من localStorage
const getToken = () => {
  return localStorage.getItem('access_token');
};

// ✅ دالة لجلب الطلبات
export const getMyRequests = async () => {
  try {
    const token = getToken();
    const response = await axios.get(`${API_BASE_URL}/my-request/requests/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// ✅ دالة لإضافة طلب جديد
export const submitNewRequest = async (requestData) => {
  try {
    const token = getToken();

    const formattedData = {
      project: {
        name: requestData.projectName || 'Default Project',
        description: requestData.purpose || '',
      },
      purpose: requestData.purpose || '',
      start_date: requestData.startDate,
      end_date: requestData.endDate,
      items: requestData.items.map((item) => ({
        material_name: item.name,
        quantity: item.qty,
      })),
    };

    const response = await axios.post(`${API_BASE_URL}/my-request/requests/`, formattedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('❌ Submit error:', error.response?.data);
    throw error.response?.data?.message || 'Failed to submit request';
  }
};

export const validateStock = async (items) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        valid: true,
        message: '✓ All materials are available! Ready to submit',
      });
    }, 500);
  });
};
