// src/Api/Requests.api.js
import axios from 'axios';

// ✅ استعملي رابط واحد فقط
const API_BASE = 'http://localhost:8000/api';

// 1. جلب جميع الطلبات
export const getMaterialRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE}/requests/`);
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};

// 2. إنشاء طلب جديد
export const createRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE}/requests/create/`, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 3. تحديث حالة الطلب (Mark Ready, Confirm Pickup, Confirm Return, Complete)
export const updateRequestStatus = async (requestId, newStatus) => {
  try {
    const response = await axios.post(`${API_BASE}/requests/${requestId}/status/`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
