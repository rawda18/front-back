import axios from 'axios';

// ✅ غيري الرابط إلى 8000
const API_BASE_URL = 'http://localhost:8001';

// دالة لجلب الـ Token
const getToken = () => {
  return localStorage.getItem('access_token');
};

export const fetchProjects = async () => {
  try {
    const token = getToken();
    // ✅ استعمل نفس endpoint تاع my-request
    const response = await axios.get(`${API_BASE_URL}/my-request/projects/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // تحويل البيانات من شكل API إلى شكل الـ Frontend
    const projects = (response.data.results || response.data).map((project) => ({
      id: project.id,
      title: project.name,
      desc: project.description || 'No description',
      createdAt: new Date(project.created_at).toLocaleDateString('fr-FR'),
      members: project.team_members?.length || 1,
    }));
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const addProject = async (newProject) => {
  try {
    const token = getToken();
    // ✅ نفس endpoint الصحيح
    const response = await axios.post(
      `${API_BASE_URL}/my-request/projects/`,
      {
        name: newProject.title,
        description: newProject.desc,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      id: response.data.id,
      title: response.data.name,
      desc: response.data.description || 'No description',
      createdAt: new Date(response.data.created_at).toLocaleDateString('fr-FR'),
      members: 1,
    };
  } catch (error) {
    console.error('Error adding project:', error);
    throw error;
  }
};

export const deleteProject = async (id) => {
  try {
    const token = getToken();
    await axios.delete(`${API_BASE_URL}/my-request/projects/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};
