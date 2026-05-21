// src/Api/projects.api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const fetchProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`);
    // تحويل البيانات من شكل API إلى شكل الـ Frontend
    const projects = response.data.results.map((project) => ({
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
    const response = await axios.post(`${API_BASE_URL}/projects/`, {
      name: newProject.title,
      description: newProject.desc,
    });

    // تحويل الـ Response إلى شكل الـ Frontend
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
    await axios.delete(`${API_BASE_URL}/projects/${id}/`);
    return true;
  } catch (error) {
    console.error('Error deleting project:', error);
    return false;
  }
};
