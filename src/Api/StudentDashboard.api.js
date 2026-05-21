// src/Api/studentDashboard.api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchDashboardProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`);
    // تحويل البيانات إلى شكل الـ Frontend
    return response.data.results.map((project) => ({
      id: project.id,
      title: project.name,
      desc: project.description || 'No description',
      members: project.team_members?.length || 1,
      createdAt: new Date(project.created_at).toLocaleDateString('fr-FR'),
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchDashboardRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests/`);
    // تصفية الطلبات للطالب الحالي فقط (حسب student_id)
    // مؤقتاً نرجع كل الطلبات
    return response.data.results.map((request) => ({
      id: request.id,
      project: request.project_name,
      items: request.items.length,
      status: request.status_display,
      updatedAt: new Date(request.updated_at).toLocaleDateString('fr-FR'),
    }));
  } catch (error) {
    console.error('Error fetching requests:', error);
    return [];
  }
};
