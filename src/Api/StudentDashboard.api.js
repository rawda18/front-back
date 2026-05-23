// ✅ الرابط الصحيح لهاد الـ Backend
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001';

export const fetchDashboardProjects = async () => {
  try {
    // ✅ أضفنا my-request/
    const response = await axios.get(`${API_BASE_URL}/my-request/projects/`);
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchDashboardRequests = async () => {
  try {
    // ✅ أضفنا my-request/
    const response = await axios.get(`${API_BASE_URL}/my-request/requests/`);
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};
